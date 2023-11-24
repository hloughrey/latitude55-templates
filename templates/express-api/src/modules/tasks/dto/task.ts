import { IsBoolean, IsEmpty, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class Task {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsBoolean()
  @IsNotEmpty()
  completed: boolean;

  @IsEmpty()
  createdDate?: string;

  @IsEmpty()
  lastUpdateDate?: string;
}
