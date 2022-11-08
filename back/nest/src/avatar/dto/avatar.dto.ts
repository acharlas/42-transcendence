import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import {
  IsFile,
  MaxFileSize,
  MinFileSize,
  HasMimeType,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class AvatarUploadDto {
  @ApiProperty()
  @IsFile()
  @MaxFileSize(1e6)
  @MinFileSize(1)
  @HasMimeType(['image/jpeg', 'image/png'])
  avatar?: MemoryStoredFile;
}

export class AvatarPathDto {
  @IsString()
  @IsNotEmpty()
  path: string;
}

