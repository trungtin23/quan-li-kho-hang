import { PartialType } from '@nestjs/mapped-types';
import { CreateImportTransactionDTO } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(
  CreateImportTransactionDTO,
) {}
