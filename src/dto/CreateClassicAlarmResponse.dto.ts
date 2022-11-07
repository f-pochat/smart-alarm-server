import { IsByteLength, IsNotEmpty } from 'class-validator';

export class CreateClassicAlarmResponseDto {
  @IsNotEmpty()
  time: Date;

  @IsNotEmpty()
  @IsByteLength(1, 50)
  name: string;

  @IsNotEmpty()
  days: string;

  @IsNotEmpty()
  id: string;

  @IsNotEmpty()
  createdAt: Date;

  @IsNotEmpty()
  deviceId: string;
}
