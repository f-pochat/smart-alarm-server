import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ClassicAlarmService } from '../services/classic-alarm.service';
import { CreateClassicAlarmDto } from '../../../dto/CreateClassicAlarm.dto';
import { CreateClassicAlarmResponseDto } from '../../../dto/CreateClassicAlarmResponse.dto';
import { ClassicAlarm } from '../../../entity/classic-alarm.entity';

@Controller('classic')
export class ClassicAlarmController {
  constructor(private readonly appService: ClassicAlarmService) {}

  @Post()
  // @UsePipes(
  //   new ValidationPipe({
  //     transform: true,
  //     expectedType: CreateClassicAlarmDto,
  //   }),
  // )
  async createAlarm(
    @Body() alarm: CreateClassicAlarmDto,
  ): Promise<CreateClassicAlarmResponseDto> {
    console.log(alarm);
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
}
