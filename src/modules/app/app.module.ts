import { Module } from '@nestjs/common';
import { ClassicAlarmController } from './controllers/classic-alarm.controller';
import { ClassicAlarmService } from './services/classic-alarm.service';
import { ClassicAlarmRepository } from './repositories/classic-alarm.repository';
import { DatabaseService } from '../../shared/service';
import { SmartAlarmController } from './controllers/smart-alarm.controller';
import { SmartAlarmService } from './services/smart-alarm.service';
import { SmartAlarmRepository } from './repositories/smart-alarm.repository';
import { AppController } from './controllers/app.controller';

@Module({
  imports: [],
  controllers: [ClassicAlarmController, SmartAlarmController, AppController],
  providers: [
    ClassicAlarmService,
    ClassicAlarmRepository,
    DatabaseService,
    SmartAlarmService,
    SmartAlarmRepository,
  ],
})
export class AppModule {}
