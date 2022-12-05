import { Inject, Injectable } from '@nestjs/common';
import { SmartAlarmRepository } from '../repositories/smart-alarm.repository';
import { SmartAlarm } from '../../../entity/smart-alarm.entity';
import { CreateSmartAlarmDto } from '../../../dto/CreateSmartAlarm.dto';
import { MapsApiError, NotFoundError } from '../../../shared/errors';
import { ScheduleService } from './schedule.service';
import { formatTime } from '../utils/utils';

const axios = require('axios');

@Injectable()
export class SmartAlarmService {
  constructor(
    @Inject(SmartAlarmRepository)
    private readonly app: SmartAlarmRepository,
    @Inject(ScheduleService)
    private schedule: ScheduleService,
  ) {}

  async createAlarm(alarm: CreateSmartAlarmDto): Promise<SmartAlarm> {
    const al = await this.app.create({
      ...alarm,
      arrivalTime: new Date(alarm.arrivalTime),
    });
    axios
      .get(
        `https://maps.googleapis.com/maps/api/directions/json?departure_time=now&destination=${al.destinationLocationLat},%20${al.destinationLocationLong}&origin=${al.alarmLocationLat},%20${al.alarmLocationLong}&key=${process.env.MAPS_API}&traffic_model=best_guess`,
      )
      .then((r) => {
        const travelMinutes = formatTime(
          r.data.routes[0].legs[0].duration_in_traffic.text,
        );
        this.schedule.setSmartAlarm(
          al.id,
          new Date(
            al.arrivalTime.valueOf() -
              travelMinutes * 60 * 1000 -
              al.preparationTime * 60 * 1000,
          ),
        );
      })
      .catch((e) => {
        throw new MapsApiError(e.message);
      });
    return al;
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
