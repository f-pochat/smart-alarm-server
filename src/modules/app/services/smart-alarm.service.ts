import { Inject, Injectable } from '@nestjs/common';
import { CreateClassicAlarmDto } from '../../../dto/CreateClassicAlarm.dto';
import { CreateClassicAlarmResponseDto } from '../../../dto/CreateClassicAlarmResponse.dto';
import { ClassicAlarmRepository } from '../repositories/classic-alarm.repository';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';
import { SmartAlarmRepository } from '../repositories/smart-alarm.repository';
import { SmartAlarm } from '../../../entity/smart-alarm.entity';
import { CreateSmartAlarmDto } from '../../../dto/CreateSmartAlarm.dto';

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
}
