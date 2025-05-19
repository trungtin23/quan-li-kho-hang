import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { SlotModule } from 'src/slot/slot.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]), // 👈 Đây là bước QUAN TRỌNG
    SlotModule,
  ],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
