import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// DTO chi tiết sản phẩm - được tạo ở bước 4.3.1
export class CreateTransactionDetailDTO {
  @IsNumber()
  @IsNotEmpty()
  productId: number; // ID sản phẩm - nhập ở 4.3.1

  @IsString()
  @IsNotEmpty()
  productName: string; // Tên sản phẩm - nhập ở 4.3.1

  @IsNumber()
  @IsNotEmpty()
  price: number; // Giá sản phẩm - nhập ở 4.3.1

  @IsNumber()
  @IsNotEmpty()
  quantity: number; // Số lượng sản phẩm - nhập ở 4.3.1

  @IsString()
  @IsOptional()
  description?: string; // Mô tả sản phẩm - nhập ở 4.3.1
}
