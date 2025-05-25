import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InventoryCheckController } from './inventory-check.controller';
import { InventoryCheckService } from './inventory-check.service';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDetail } from '../entities/transaction-detail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Warehouse } from '../entities/warehouse.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Transaction,
      TransactionDetail,
      Product,
      User,
      Warehouse,
    ]),
  ],
  controllers: [InventoryCheckController],
  providers: [InventoryCheckService],
  exports: [InventoryCheckService],
})
export class InventoryCheckModule {}
