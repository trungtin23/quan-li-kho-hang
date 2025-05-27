import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDetail } from '../entities/transaction-detail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Supplier } from '../entities/supplier.entity';
import { Carrier } from '../entities/carrier.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      TransactionDetail,
      Product,
      User,
      Warehouse,
      Supplier,
      Carrier,
    ]),
  ],
  controllers: [TransactionController],
  providers: [TransactionService],
  exports: [TransactionService],
})
export class TransactionModule {}
