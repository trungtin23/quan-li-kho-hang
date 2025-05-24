import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotModule } from 'src/slot/slot.module';
import { Product } from 'src/entities/product.entity';
import { ProductRepository } from './repository/product.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), 
    SlotModule,
  ],
  controllers: [ProductController],
  providers: [ProductService,ProductRepository],

})
export class ProductModule {}
