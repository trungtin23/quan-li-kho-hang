import { PartialType } from '@nestjs/mapped-types';
import { CreateTransactionDetailDTO } from './create-transaction-detail.dto';

export class UpdateTransactionDetailDto extends PartialType(
  CreateTransactionDetailDTO,
) {}
