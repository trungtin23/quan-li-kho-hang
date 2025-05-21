import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { Repository } from 'typeorm';

export class ProductRepository {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  async findAll() {
    return this.productRepository.find();
  }
  async getPriceRange() {
    const priceResult = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'minPrice')
      .addSelect('MAX(product.price)', 'maxPrice')
      .getRawOne();
    return priceResult;
  }
  async getTimeRecieveRange() {
    const timeReceiveResult = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.timeReceive)', 'minTimeReceive')
      .addSelect('MAX(product.timeReceive)', 'maxTimeReceive')
      .getRawOne();
    return timeReceiveResult;
  }
  async getTimeDeliveryRange() {
    const timeDeliveryResult = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.timeDelivery)', 'minTimeDelivery')
      .addSelect('MAX(product.timeDelivery)', 'maxTimeDelivery')
      .getRawOne();
    return timeDeliveryResult;
  }
  async getLocation() {
    const locations = await this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.slot', 'slot')
      .select(' DISTINCT slot.row', 'row')
      .addSelect('slot.column', 'column')
      .getRawMany();
    const rows = Array.from(new Set(locations.map((loc) => loc.row)));
    const columns = Array.from(new Set(locations.map((loc) => loc.column)));
    return { rows, columns };
  }
}
