import { Inject, Injectable } from '@nestjs/common';
import { CreateClassicAlarmDto } from '../../../dto/CreateClassicAlarm.dto';
import { CreateClassicAlarmResponseDto } from '../../../dto/CreateClassicAlarmResponse.dto';
import { ClassicAlarmRepository } from '../repositories/classic-alarm.repository';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';
import { NotFoundError } from '../../../shared/errors';

@Injectable()
export class ClassicAlarmService {
  constructor(
    @Inject(ClassicAlarmRepository)
    private readonly app: ClassicAlarmRepository,
  ) {}
  async createAlarm(
    alarm: CreateClassicAlarmDto,
  ): Promise<CreateClassicAlarmResponseDto> {
    console.log(alarm.deviceId);
    // const rule = new RecurrenceRule();
    // rule.dayOfWeek = alarm.days;
    // rule.hour = createdAlarm.time.getHours();
    // rule.minute = createdAlarm.time.getMinutes();
    // const job = scheduleJob(rule, () => {
    //     client.publish("alarm", 'BEEP BEEP BEEP', { qos: 0, retain: false }, (error) => {
    //         if (error) {
    //             console.error(error)
    //         }
    //     })
    //     console.log("ALARM ACTIVATED")
    // });
    return await this.app.create({
      ...alarm,
      time: new Date(),
    });
  }

  async getAllAlarms(deviceId: string): Promise<ClassicAlarm[]> {
    return await this.app.findMany({
      where: {
        deviceId,
      },
    });
  }

  async deleteAlarm(id: string) {
    return await this.app.delete(id);
  }

  async toggleAlarm(id: string) {
    const alarm = await this.app.findOne({
      where: {
        id: id,
      },
    });

    if (!alarm) throw new NotFoundError('alarm');
    return await this.app.updateOne(id, {
      data: {
        isActive: !alarm.isActive,
      },
    });
  }
}
