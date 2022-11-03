import { Inject, Injectable } from '@nestjs/common';
import { SmartAlarmRepository } from '../repositories/smart-alarm.repository';
import { SmartAlarm } from '../../../entity/smart-alarm.entity';
import { CreateSmartAlarmDto } from '../../../dto/CreateSmartAlarm.dto';
import { NotFoundError } from '../../../shared/errors';

@Injectable()
export class SmartAlarmService {
  constructor(
    @Inject(SmartAlarmRepository)
    private readonly app: SmartAlarmRepository,
  ) {}
  async createAlarm(alarm: CreateSmartAlarmDto): Promise<SmartAlarm> {
    const createdAlarm = await this.app.create(alarm);
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
    return createdAlarm;
  }

  async getAllAlarms(deviceId: string): Promise<SmartAlarm[]> {
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
