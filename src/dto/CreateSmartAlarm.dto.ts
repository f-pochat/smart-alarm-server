import {
  IsByteLength,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
} from 'class-validator';

export class CreateSmartAlarmDto {
  @IsNotEmpty()
  @IsByteLength(1, 50)
  name: string;

  @IsNotEmpty()
  alarmLocationLat: string;

  @IsNotEmpty()
  alarmLocationLong: string;

  @IsNotEmpty()
  destinationLocationLat: string;

  @IsNotEmpty()
  destinationLocationLong: string;

  @IsNotEmpty()
  preparationTime: number;

  @IsNotEmpty()
  deviceId: string;
}
