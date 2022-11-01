import { BaseRepository } from '../../../shared/repository';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/service';
import { SmartAlarm } from '../../../entity/smart-alarm.entity';

@Injectable()
export class SmartAlarmRepository extends BaseRepository<SmartAlarm> {
  constructor(db: DatabaseService) {
    super(db, 'smartAlarm');
  }
}
