import { Inject, Injectable } from '@nestjs/common';
import { CreateClassicAlarmDto } from '../../../dto/CreateClassicAlarm.dto';
import { CreateClassicAlarmResponseDto } from '../../../dto/CreateClassicAlarmResponse.dto';
import { ClassicAlarmRepository } from '../repositories/classic-alarm.repository';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';
import { NotFoundError } from '../../../shared/errors';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';

@Injectable()
export class ClassicAlarmService {
  constructor(
    @Inject(ClassicAlarmRepository)
    private readonly app: ClassicAlarmRepository,
    private schedulerRegistry: SchedulerRegistry,
  ) {}
  async createAlarm(
    alarm: CreateClassicAlarmDto,
  ): Promise<CreateClassicAlarmResponseDto> {
    const createdAlarm = await this.app.create({
      ...alarm,
      days: alarm.days.join(','),
    });
    await this.setClassicAlarm(createdAlarm);
    return createdAlarm;
  }

  async getAllAlarms(deviceId: string): Promise<ClassicAlarm[]> {
    return await this.app.findMany({
      where: {
        deviceId,
      },
    });
  }

  async deleteAlarm(id: string) {
    this.schedulerRegistry.deleteCronJob(id);
    return await this.app.delete(id);
  }

  async toggleAlarm(id: string) {
    const alarm = await this.app.findOne({
      where: {
        id: id,
      },
    });

    if (!alarm) throw new NotFoundError('alarm');
    if (alarm.isActive) {
      this.schedulerRegistry.deleteCronJob(alarm.id);
    } else {
      await this.setClassicAlarm(alarm);
    }
    return await this.app.updateOne(id, {
      data: {
        isActive: !alarm.isActive,
      },
    });
  }

  private async setClassicAlarm(alarm: ClassicAlarm) {
    console.log(alarm);
    const job = new CronJob(
      `${alarm.time.getSeconds()} ${alarm.time.getMinutes()} ${alarm.time.getHours()} * * ${
        alarm.days ?? '*'
      }`,
      () => {
        console.log('Beep Beep Beep'); //Insert call to ESP32
        if (alarm.days) {
        } else {
          this.schedulerRegistry.deleteCronJob(alarm.id);
          this.app.updateOne(alarm.id, {
            data: {
              isActive: false,
            },
          });
        }
      },
    );
    this.schedulerRegistry.addCronJob(alarm.id, job);
    job.start();
  }
}
