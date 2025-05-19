import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProductModule } from './product/product.module';
import { UserModule } from './user/user.module';
import { SupplierModule } from './supplier/supplier.module';
import { TransactionModule } from './transaction/transaction.module';
import { CarrierModule } from './carrier/carrier.module';
import { TransactionDetailModule } from './transaction-detail/transaction-detail.module';
import { WarehouseModule } from './warehouse/warehouse.module';
import { SlotModule } from './slot/slot.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [ProductModule, UserModule, SupplierModule, TransactionModule, CarrierModule, TransactionDetailModule, WarehouseModule, SlotModule,
    TypeOrmModule.forRoot({
      url: 'mysql://root:@localhost:3306/Kho',     
      type: 'mysql',                  
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: false,  
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
