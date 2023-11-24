import { IsArray, IsBoolean, IsEmpty, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class TaskList {
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

  @IsArray()
  @IsUUID(4, { each: true })
  tasks: string[];

  @IsEmpty()
  createdDate?: string;

  @IsEmpty()
  lastUpdateDate?: string;
}
