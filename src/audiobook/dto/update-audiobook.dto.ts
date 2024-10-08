import { PartialType } from '@nestjs/mapped-types';
import { CreateAudiobookDto } from './create-audiobook.dto';

export class UpdateAudiobookDto extends PartialType(CreateAudiobookDto) {}
