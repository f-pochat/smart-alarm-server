import { IsByteLength, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClassicAlarmDto {
  @IsNotEmpty()
  @ApiProperty()
  time: Date;

  @IsNotEmpty()
  @IsByteLength(1, 50)
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  days: number[];

  @IsNotEmpty()
  @ApiProperty()
  deviceId: string;
}
