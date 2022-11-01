import {
  IsByteLength,
  IsDateString,
  IsEmpty,
  IsNotEmpty,
} from 'class-validator';

export class CreateClassicAlarmDto {
  @IsNotEmpty()
  @IsDateString()
  time: Date;

  @IsNotEmpty()
  @IsByteLength(1, 50)
  name: string;

  @IsNotEmpty()
  days: number[];

  @IsNotEmpty()
  deviceId: string;
}
