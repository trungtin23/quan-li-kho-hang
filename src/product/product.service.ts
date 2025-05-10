import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { SearchProductDto } from './dto/search.product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}
  create(createProductDto: CreateProductDto) {
    return 'This action adds a new product';
  }

  findAll() {
    return `This action returns all product`;
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
    //2.3 Truy xuất lấy dữ liệu
    // Lấy danh sách loại sản phẩm
    const productTypes = await this.productRepository
      .createQueryBuilder('product')
      .select('DISTINCT product.productType', 'productType')
      .getMany();

    // Tìm các mức giá có sẵn (Ví dụ: các mức giá có trong sản phẩm)
    const priceRanges = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.price)', 'minPrice')
      .addSelect('MAX(product.price)', 'maxPrice')
      .getRawOne();

    // Lấy các khoảng thời gian nhập hàng (timeReceive)
    const timeReceiveRanges = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.timeReceive)', 'minTimeReceive')
      .addSelect('MAX(product.timeReceive)', 'maxTimeReceive')
      .getRawOne();

    // Lấy các khoảng thời gian xuất hàng (timeDelivery)
    const timeDeliveryRanges = await this.productRepository
      .createQueryBuilder('product')
      .select('MIN(product.timeDelivery)', 'minTimeDelivery')
      .addSelect('MAX(product.timeDelivery)', 'maxTimeDelivery')
      .getRawOne();
    // 2.4 return dữ liệu cho bộ tìm kiếm
    return {
      productTypes, // Danh sách loại sản phẩm
      priceRanges, // Khoảng giá sản phẩm
      timeReceiveRanges, // Khoảng thời gian nhập hàng
      timeDeliveryRanges, // Khoảng thời gian xuất hàng
    };
  }
  async searchProducts(dto: SearchProductDto): Promise<Product[]> {
    // 2.10 Truy xuất lấy dữ liệu 
    const query = this.productRepository.createQueryBuilder('product');

    if (dto.productName) {
      query.andWhere('product.productName ILIKE :name', {
        name: `%${dto.productName}%`,
      });
    }

    if (dto.minPrice) {
      query.andWhere('product.price >= :minPrice', { minPrice: dto.minPrice });
    }

    if (dto.maxPrice) {
      query.andWhere('product.price <= :maxPrice', { maxPrice: dto.maxPrice });
    }

    if (dto.timeReceiveFrom) {
      query.andWhere('product.timeReceive >= :from', {
        from: dto.timeReceiveFrom,
      });
    }

    if (dto.timeReceiveTo) {
      query.andWhere('product.timeReceive <= :to', {
        to: dto.timeReceiveTo,
      });
    }

    // Sắp xếp
    if (dto.sortBy) {
      const order = dto.sortOrder || 'ASC';
      query.orderBy(
        `product.${dto.sortBy}`,
        order.toUpperCase() as 'ASC' | 'DESC',
      );
    }

    // Phân trang
    const page = dto.page || 1;
    const limit = dto.limit || 10;
    query.skip((page - 1) * limit).take(limit);
    // 2.11 return danh sách hàng đã tìm kiếm
    return await query.getMany();
  }
}
