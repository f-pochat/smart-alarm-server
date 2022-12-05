import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { SmartAlarmRepository } from '../repositories/smart-alarm.repository';
import { MapsApiError } from '../../../shared/errors';
import { formatTime } from '../utils/utils';
import { CronJob } from 'cron';
import { client } from '../../../main';
import { ClassicAlarmRepository } from '../repositories/classic-alarm.repository';

const axios = require('axios');

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(SmartAlarmRepository)
    private readonly smartAlarmRepository: SmartAlarmRepository,
    @Inject(ClassicAlarmRepository)
    private readonly classicAlarmRepository: ClassicAlarmRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  // Every N time it iters over every active smart alarm
  // and sets the job
  @Cron(CronExpression.EVERY_10_MINUTES) //deployment,  change when developing
  async checkForTriggerAlarms() {
    const alarms = await this.smartAlarmRepository.findMany({
      where: {
        isActive: true,
      },
    });
    alarms.map((a) => {
      axios
        .get(
          `https://maps.googleapis.com/maps/api/directions/json?departure_time=now&destination=${a.destinationLocationLat},%20${a.destinationLocationLong}&origin=${a.alarmLocationLat},%20${a.alarmLocationLong}&key=${process.env.MAPS_API}&traffic_model=best_guess`,
        )
        .then((r) => {
          const travelMinutes = formatTime(
            r.data.routes[0].legs[0].duration_in_traffic.text,
          );
          this.setSmartAlarm(
            a.id,
            new Date(
              a.arrivalTime.valueOf() -
                travelMinutes * 60 * 1000 -
                a.preparationTime * 60 * 1000,
            ),
          );
        })
        .catch((e) => {
          throw new MapsApiError(e.message);
        });
    });
  }

  //Tries to find a running job, if throws error (does not find it),
  //creates a new one, else,
  //setTheNewHour
  async setSmartAlarm(id: string, date: Date) {
    //Check if it is an old alarm
    if (date < new Date()) {
      await this.smartAlarmRepository.updateOne(id, {
        data: {
          isActive: false,
        },
      });
      return;
    }
    try {
      await this.smartAlarmRepository.updateOne(id, {
        data: {
          activationTime: date,
        },
      });
      await this.sendAlarmsNow();
    } catch (e) {
      const job = new CronJob(
        `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} *`,
        () => {
          this.schedulerRegistry.deleteCronJob(id);
          this.smartAlarmRepository.updateOne(id, {
            data: {
              isActive: false,
            },
          });
        },
      );
      this.schedulerRegistry.addCronJob(id, job);
      job.start();
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async sendAlarms() {
    const smartAlarms = (
      await this.smartAlarmRepository.findMany({
        where: {
          isActive: true,
        },
      })
    ).map(
      (a) =>
        `${a.activationTime
          .getHours()
          .toString()
          .padStart(2, '0')}${a.activationTime
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
    );
    const classicAlarms = (
      await this.classicAlarmRepository.findMany({
        where: {
          isActive: true,
        },
      })
    )
      .filter(
        (a) =>
          a.days.length === 0 ||
          a.days.includes(new Date().getDay().toString()) ||
          a.days.includes((new Date().getDay() + 7).toString()),
      )
      .map(
        (a) =>
          `${a.time.getHours().toString().padStart(2, '0')}${a.time
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
      );

    const allAlarmsData = [...smartAlarms, ...classicAlarms];

    client.publish(
      'smart-alarm',
      allAlarmsData.toString() + ',',
      { qos: 0, retain: false },
      (error) => {
        if (error) console.error(error);
      },
    );
  }

  async sendAlarmsNow() {
    const smartAlarms = (
      await this.smartAlarmRepository.findMany({
        where: {
          isActive: true,
        },
      })
    ).map(
      (a) =>
        `${a.activationTime
          .getHours()
          .toString()
          .padStart(2, '0')}${a.activationTime
          .getMinutes()
          .toString()
          .padStart(2, '0')}`,
    );
    const classicAlarms = (
      await this.classicAlarmRepository.findMany({
        where: {
          isActive: true,
        },
      })
    )
      .filter(
        (a) =>
          a.days.length === 0 ||
          a.days.includes(new Date().getDay().toString()) ||
          a.days.includes((new Date().getDay() + 7).toString()),
      )
      .map(
        (a) =>
          `${a.time.getHours().toString().padStart(2, '0')}${a.time
            .getMinutes()
            .toString()
            .padStart(2, '0')}`,
      );

    const allAlarmsData = [...smartAlarms, ...classicAlarms];

    client.publish(
      'smart-alarm',
      allAlarmsData.toString() + ',',
      { qos: 0, retain: false },
      (error) => {
        if (error) console.error(error);
      },
    );
  }
}
