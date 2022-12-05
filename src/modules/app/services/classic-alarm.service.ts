import { Inject, Injectable } from '@nestjs/common';
import { CreateClassicAlarmDto } from '../../../dto/CreateClassicAlarm.dto';
import { CreateClassicAlarmResponseDto } from '../../../dto/CreateClassicAlarmResponse.dto';
import { ClassicAlarmRepository } from '../repositories/classic-alarm.repository';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';
import { NotFoundError } from '../../../shared/errors';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { ScheduleService } from './schedule.service';

@Injectable()
export class ClassicAlarmService {
  constructor(
    @Inject(ClassicAlarmRepository)
    private readonly app: ClassicAlarmRepository,
    @Inject(ScheduleService)
    private readonly scheduleService: ScheduleService,

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
    await this.scheduleService.sendAlarmsNow();
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
    if (this.schedulerRegistry.getCronJob(id)) {
      this.schedulerRegistry.deleteCronJob(id);
    }
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
    const job = new CronJob(
      `${alarm.time.getUTCSeconds()} ${alarm.time.getUTCMinutes()} ${alarm.time.getUTCHours()} * * ${
        alarm.days.length ? alarm.days : '*'
      }`,
      () => {
        if (alarm.days) {
        } else {
          this.schedulerRegistry.deleteCronJob(alarm.id);
          this.app.updateOne(alarm.id, {
            data: {
              isActive: false,
            },
          });
          console.log('Finished');
        }
      },
    );
    this.schedulerRegistry.addCronJob(alarm.id, job);
    job.start();
  }
}
