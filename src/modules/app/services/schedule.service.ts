import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { SmartAlarmRepository } from '../repositories/smart-alarm.repository';
import { MapsApiError } from '../../../shared/errors';
import { formatTime } from '../utils/utils';
import { CronJob, CronTime } from 'cron';

const axios = require('axios');

@Injectable()
export class ScheduleService {
  constructor(
    @Inject(SmartAlarmRepository)
    private readonly app: SmartAlarmRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  // Every N time it iters over every active smart alarm
  // and sets the job
  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_NOON) //For deployment, change when developping
  async checkForTriggerAlarms() {
    const alarms = await this.app.findMany({
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
  private async setSmartAlarm(id: string, date: Date) {
    //Check if it is an old alarm
    if (date < new Date()) {
      await this.app.updateOne(id, {
        data: {
          isActive: false,
        },
      });
      return;
    }
    try {
      const alarm = this.schedulerRegistry.getCronJob(id);
      alarm.setTime(
        new CronTime(
          `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} *`,
        ),
      );
    } catch (e) {
      const job = new CronJob(
        `${date.getSeconds()} ${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${date.getMonth()} *`,
        () => {
          console.log('Beep Beep Beep'); //Insert call to ESP32 for sound
          this.schedulerRegistry.deleteCronJob(id);
          this.app.updateOne(id, {
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
}
