import { Module } from '@nestjs/common';
import { TransactionDetailService } from './transaction-detail.service';
import { TransactionDetailController } from './transaction-detail.controller';

@Module({
  controllers: [TransactionDetailController],
  providers: [TransactionDetailService],
})
export class TransactionDetailModule {}
