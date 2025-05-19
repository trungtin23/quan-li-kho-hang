import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SearchProductDto } from './dto/search.product.dto';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productService.findAll();
  }
  @Get('search-conditions')
  async getSearchConditions() {
    try {
      const conditions = await this.productService.getSearchConditions();
      return {
        status: 200,
        message: 'Lấy điều kiện tìm kiếm thành công.',
        data: conditions,
      };
    } catch (error) {
      return {
        status: 500,
        message: error.message || 'Lỗi máy chủ nội bộ.',
        data: null,
      };
    }
  }
  @Get('search')
  async search(@Query() searchDto: SearchProductDto) {
    try {
      // 2.9 Gọi service lấy hàng theo SearchProductDto
      const result = await this.productService.searchProducts(searchDto);
      // 2.12 return danh sách hàng cho giao diện
      // Nếu không tìm thấy sản phẩm
      if (result.length === 0) {
        return {
          status: HttpStatus.NOT_FOUND,
          message: 'Không tìm thấy sản phẩm phù hợp.',
          data: [],
          dataLength: 0,
        };
      }

      // Nếu tìm thấy sản phẩm
      return {
        status: HttpStatus.OK,
        message: 'Tìm thấy sản phẩm.',
        data: result,
        dataLength: result.length,
      };
    } catch (error) {
      // Kiểm tra nếu là HttpException để lấy status và message gốc
      if (error.status && error.response) {
        return {
          status: error.status,
          message:
            error.response.message || 'Lỗi xảy ra khi tìm kiếm sản phẩm.',
          data: [],
          dataLength: 0,
        };
      }

      // Lỗi không xác định hoặc không phải HttpException
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Có lỗi xảy ra trong quá trình xử lý. Vui lòng thử lại sau.',
        data: [],
        dataLength: 0,
      };
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productService.update(+id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productService.remove(+id);
  }
}
