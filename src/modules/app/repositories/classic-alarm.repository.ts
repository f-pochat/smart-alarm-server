import { ClassicAlarm } from '../../../entity/classic-alarm.entity';
import { BaseRepository } from '../../../shared/repository';
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../../shared/service';

@Injectable()
export class ClassicAlarmRepository extends BaseRepository<ClassicAlarm> {
  constructor(db: DatabaseService) {
    super(db, 'classicAlarm');
  }
}
