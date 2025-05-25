import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';

// [1.1] DTO cho việc tạo phiếu kiểm kê mới
export class CreateInventoryCheckDTO {
  @IsNumber()
  @IsNotEmpty()
  warehouseId: number; // [1.1] ID kho cần kiểm kê

  @IsNumber()
  @IsNotEmpty()
  userId: number; // [1.1] ID người tạo phiếu

  @IsString()
  @IsOptional()
  notes?: string; // [1.1] Ghi chú (tùy chọn)

  @IsDate()
  @IsOptional()
  @Type(() => Date)
  checkDate?: Date; // [1.1] Ngày kiểm kê (tùy chọn)
}

// [2.1] DTO chi tiết cho mỗi sản phẩm khi hoàn thành kiểm kê
export class InventoryCheckDetailDTO {
  @IsNumber()
  @IsNotEmpty()
  productId: number; // [2.1] ID sản phẩm

  @IsNumber()
  @IsNotEmpty()
  expectedQuantity: number; // [2.1] Số lượng dự kiến theo hệ thống

  @IsNumber()
  @IsNotEmpty()
  actualQuantity: number; // [2.1] Số lượng thực tế sau kiểm kê

  @IsString()
  @IsOptional()
  notes?: string; // [2.1] Ghi chú về sự chênh lệch
}

// [2.1] DTO cho việc hoàn thành phiếu kiểm kê
export class CompleteInventoryCheckDTO {
  @IsNumber()
  @IsNotEmpty()
  transactionId: number; // [2.1] ID phiếu kiểm kê cần hoàn thành

  @IsString()
  @IsOptional()
  status?: string; // [2.1] Trạng thái mới (mặc định "COMPLETED")

  @Type(() => InventoryCheckDetailDTO)
  details: InventoryCheckDetailDTO[]; // [2.1] Chi tiết số lượng thực tế
}
