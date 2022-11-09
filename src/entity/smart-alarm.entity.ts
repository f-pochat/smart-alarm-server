export class SmartAlarm {
  id: string;
  createdAt: Date;
  name: string;
  isActive: boolean;
  deviceId: string;
  preparationTime: number;
  arrivalTime: Date;
  alarmLocationLat: string;
  alarmLocationLong: string;
  destinationLocationLat: string;
  destinationLocationLong: string;
  activationTime: Date;
}
