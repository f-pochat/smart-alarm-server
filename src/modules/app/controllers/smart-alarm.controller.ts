import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ClassicAlarmService } from '../services/classic-alarm.service';
import { CreateClassicAlarmDto } from '../../../dto/CreateClassicAlarm.dto';
import { CreateClassicAlarmResponseDto } from '../../../dto/CreateClassicAlarmResponse.dto';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';
import { CreateSmartAlarmDto } from '../../../dto/CreateSmartAlarm.dto';
import { SmartAlarm } from '../../../entity/smart-alarm.entity';
import { SmartAlarmService } from '../services/smart-alarm.service';

@Controller('smart')
export class SmartAlarmController {
  constructor(private readonly appService: SmartAlarmService) {}

  @Post()
  async createAlarm(@Body() alarm: CreateSmartAlarmDto): Promise<SmartAlarm> {
    console.log(alarm);
    return await this.appService.createAlarm(alarm);
  }

  @Get('/:id')
  async getAllAlarms(@Param('id') deviceId): Promise<SmartAlarm[]> {
    return await this.appService.getAllAlarms(deviceId);
  }

  @Delete('/:id')
  async deleteAlarm(@Param('id') id) {
    await this.appService.deleteAlarm(id);
  }
}
