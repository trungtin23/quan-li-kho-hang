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
  @Get('search-conditions')
  async getSearchConditions() {
    //2.2 Gọi service để lấy điều kiện tìm kiếm
    const conditions = await this.productService.getSearchConditions();
    // 2.5 return dữ liệu cho giao diện
    return {
      status: 200,
      message: 'Lấy điều kiện tìm kiếm thành công.',
      data: conditions,
    };
  }
  @Get('search')
  async search(@Query() searchDto: SearchProductDto) {
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
  }
}
