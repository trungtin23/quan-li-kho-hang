import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

// [4.2] DTO chi tiết sản phẩm cho transaction
export class CreateTransactionDetailDTO {
  @IsNumber()
  @IsNotEmpty()
  productId: number; // [4.2] ID sản phẩm

  @IsString()
  @IsNotEmpty()
  productName: string; // [4.2] Tên sản phẩm

  @IsNumber()
  @IsNotEmpty()
  price: number; // [4.2] Giá sản phẩm

  @IsNumber()
  @IsNotEmpty()
  quantity: number; // [4.2] Số lượng

  @IsString()
  @IsOptional()
  description?: string; // [4.2] Mô tả sản phẩm
}
