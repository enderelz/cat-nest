import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto.js';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
