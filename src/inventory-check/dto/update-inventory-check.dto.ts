import { PartialType } from '@nestjs/mapped-types';
import { CreateInventoryCheckDTO } from './create-inventory-check.dto';

export class UpdateInventoryCheckDto extends PartialType(
  CreateInventoryCheckDTO,
) {}
