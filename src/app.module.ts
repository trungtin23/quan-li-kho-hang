import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { SupplierModule } from './supplier/supplier.module';
import { CarrierModule } from './carrier/carrier.module';
import { Warehouse } from './entities/warehouse.entity';
import { SlotModule } from './slot/slot.module';
import { ProductModule } from './product/product.module';
import { TransactionModule } from './transaction/transaction.module';
import { InventoryCheckModule } from './inventory-check/inventory-check.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306),
        username: configService.get('DB_USERNAME', 'root'),
        password: configService.get('DB_PASSWORD', ''),
        database: configService.get('DB_DATABASE', 'warehouse_management'),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: configService.get<boolean>('DB_SYNCHRONIZE', false), // Chỉ true trong môi trường development
        logging: configService.get<boolean>('DB_LOGGING', false),
      }),
    }),

    // Đăng ký các modules
    UserModule,
    SupplierModule,
    CarrierModule,
    Warehouse,
    SlotModule,
    ProductModule,
    TransactionModule,
    InventoryCheckModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
