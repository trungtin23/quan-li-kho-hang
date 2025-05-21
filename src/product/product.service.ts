import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SearchProductDto } from './dto/search.product.dto';
import { SlotService } from 'src/slot/slot.service';
import { SearchProductResponse } from './response/SearchProductResponse';
import { Product } from 'src/entities/product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    private readonly slotService: SlotService,
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
    // 2.3 Truy xuất lấy dữ liệu
    try {
      const priceResult = await this.productRepository
        .createQueryBuilder('product')
        .select('MIN(product.price)', 'minPrice')
        .addSelect('MAX(product.price)', 'maxPrice')
        .getRawOne();

      const timeReceiveResult = await this.productRepository
        .createQueryBuilder('product')
        .select('MIN(product.timeReceive)', 'minTimeReceive')
        .addSelect('MAX(product.timeReceive)', 'maxTimeReceive')
        .getRawOne();

      const timeDeliveryResult = await this.productRepository
        .createQueryBuilder('product')
        .select('MIN(product.timeDelivery)', 'minTimeDelivery')
        .addSelect('MAX(product.timeDelivery)', 'maxTimeDelivery')
        .getRawOne();

      const slotIdsRaw = await this.productRepository
        .createQueryBuilder('product')
        .select('DISTINCT product.slotId', 'slotId')
        .getRawMany();

      const slotIds = slotIdsRaw.map((s) => s.slotId);

      // Lấy danh sách row và column từ các slot
      const rowsSet = new Set<string>();
      const columnsSet = new Set<string>();

      for (const slotId of slotIds) {
        const slot = await this.slotService.findOne(slotId);
        if (slot) {
          rowsSet.add(slot.row);
          columnsSet.add(slot.column);
        }
      }

      // Chuyển Set sang mảng, sắp xếp tăng dần
      const rows = Array.from(rowsSet).sort((a, b) => a.localeCompare(b));
      const columns = Array.from(columnsSet).sort((a, b) => a.localeCompare(b));
      return {
        priceRanges: {
          minPrice: parseFloat(priceResult.minPrice) || 0,
          maxPrice: parseFloat(priceResult.maxPrice) || 0,
        },
        timeReceiveRanges: {
          minTimeReceive: timeReceiveResult.minTimeReceive
            ? new Date(timeReceiveResult.minTimeReceive)
                .toISOString()
                .slice(0, 10)
            : null,
          maxTimeReceive: timeReceiveResult.maxTimeReceive
            ? new Date(timeReceiveResult.maxTimeReceive)
                .toISOString()
                .slice(0, 10)
            : null,
        },
        timeDeliveryRanges: {
          minTimeDelivery: timeDeliveryResult.minTimeDelivery
            ? new Date(timeDeliveryResult.minTimeDelivery)
                .toISOString()
                .slice(0, 10)
            : null,
          maxTimeDelivery: timeDeliveryResult.maxTimeDelivery
            ? new Date(timeDeliveryResult.maxTimeDelivery)
                .toISOString()
                .slice(0, 10)
            : null,
          slotRows: rows,
          slotColumns: columns,
        },
      };
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async searchProducts(
    dto: SearchProductDto,
  ): Promise<SearchProductResponse[]> {
    try {
      const query = this.productRepository.createQueryBuilder('product');

      if (dto.productName) {
        query.andWhere('product.productName LIKE :name', {
          name: `%${dto.productName}%`,
        });
      }

      if (dto.minPrice) {
        query.andWhere('product.price >= :minPrice', {
          minPrice: dto.minPrice,
        });
      }

      if (dto.maxPrice) {
        query.andWhere('product.price <= :maxPrice', {
          maxPrice: dto.maxPrice,
        });
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

      const page = dto.page || 1;
      const limit = dto.limit || 10;
      query.skip((page - 1) * limit).take(limit);

      const products = await query.getMany();

      const results: SearchProductResponse[] = await Promise.all(
        products.map(async (product) => {
          const slot = await this.slotService.findOne(product.slotId); 
          const slotLocation = `${slot.row}-${slot.column}`;

          return new SearchProductResponse( 
            product.productId,
            slotLocation,
            product.productName,
            product.price,
            product.stock,
            product.description,
            product.timeReceive,
            product.timeDelivery,
          );
        }),
      );

      return results;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Có lỗi xảy ra khi tìm kiếm sản phẩm. Vui lòng thử lại sau.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
