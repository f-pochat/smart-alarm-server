import { Controller, Get, Param } from '@nestjs/common';
import { ClassicAlarmService } from '../services/classic-alarm.service';
import { SmartAlarmService } from '../services/smart-alarm.service';
import { SmartAlarm } from '../../../entity/smart-alarm.entity';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';

@Controller()
export class AppController {
  constructor(
    private readonly classicService: ClassicAlarmService,
    private readonly smartService: SmartAlarmService,
  ) {}

  @Get('/:id')
  async getAllAlarms(
    @Param('id') deviceId,
  ): Promise<(SmartAlarm | ClassicAlarm)[]> {
    return [
      ...(await this.classicService.getAllAlarms(deviceId)),
      ...(await this.smartService.getAllAlarms(deviceId)),
    ];
  }
}
