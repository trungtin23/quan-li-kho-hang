import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { ProductRepository } from './repository/product.repository';
import { SearchProductResponse } from './response/SearchConditionResponse';

@Injectable()
export class ProductService {
  constructor(
    private productRepository: ProductRepository,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  async findAll() {
    return this.productRepository.findAll();
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
  async getSearchConditions() {
    try {
      const priceResult = await this.productRepository.getPriceRange();
      const timeReceiveResult =
        await this.productRepository.getTimeRecieveRange();
      const timeDeliveryResult =
        await this.productRepository.getTimeDeliveryRange();
      const locationResult = await this.productRepository.getLocation();
      const response = new SearchProductResponse()
        .setPriceRanges(priceResult.minPrice, priceResult.maxPrice)
        .setTimeReceiveRanges(
          timeReceiveResult.minTimeReceive,
          timeReceiveResult.maxTimeReceive,
        )
        .setTimeDeliveryRanges(
          timeDeliveryResult.minTimeDelivery,
          timeDeliveryResult.maxTimeDelivery,
        )
        .setSlotRows(locationResult.rows)
        .setSlotColumns(locationResult.columns)
        .build();
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  }
}
