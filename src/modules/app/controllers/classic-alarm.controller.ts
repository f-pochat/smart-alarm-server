import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ClassicAlarmService } from '../services/classic-alarm.service';
import { CreateClassicAlarmDto } from '../../../dto/CreateClassicAlarm.dto';
import { CreateClassicAlarmResponseDto } from '../../../dto/CreateClassicAlarmResponse.dto';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';

@Controller('classic')
export class ClassicAlarmController {
  constructor(private readonly appService: ClassicAlarmService) {}

  @Post()
  async createAlarm(
    @Body() alarm: CreateClassicAlarmDto,
  ): Promise<CreateClassicAlarmResponseDto> {
    return await this.appService.createAlarm(alarm);
  }

  @Get('/:id')
  async getAllAlarms(@Param('id') deviceId): Promise<ClassicAlarm[]> {
    return await this.appService.getAllAlarms(deviceId);
  }

  @Delete('/:id')
  async deleteAlarm(@Param('id') id) {
    await this.appService.deleteAlarm(id);
  }

  @Put('/:id')
  async toggleAlarm(@Param('id') id) {
    await this.appService.toggleAlarm(id);
  }
}
