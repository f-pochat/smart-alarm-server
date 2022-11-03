import { IsByteLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSmartAlarmDto {
  @IsNotEmpty()
  @IsByteLength(1, 50)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  alarmLocationLat: string;

  @ApiProperty()
  @IsNotEmpty()
  alarmLocationLong: string;

  @IsNotEmpty()
  @ApiProperty()
  destinationLocationLat: string;

  @IsNotEmpty()
  @ApiProperty()
  destinationLocationLong: string;

  @IsNotEmpty()
  @ApiProperty()
  preparationTime: number;

  @IsNotEmpty()
  @ApiProperty()
  arrivalTime: Date;

  @IsNotEmpty()
  @ApiProperty()
  deviceId: string;
}
