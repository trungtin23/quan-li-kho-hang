import {
  IsDate,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateTransactionDetailDTO } from '../../transaction-detail/dto/create-transaction-detail.dto';

// DTO tạo mới phiếu nhập kho - được tạo ở bước 4.4.2
export class CreateImportTransactionDTO {
  @IsString()
  @IsNotEmpty()
  transactionCode: string; // Mã phiếu nhập (VD: NK001) - nhập ở 4.2.1

  @IsNumber()
  @IsNotEmpty()
  userId: number; // ID nhân viên - nhập ở 4.2.1

  @IsString()
  @IsNotEmpty()
  employeeName: string; // Tên nhân viên - nhập ở 4.2.1

  @IsNumber()
  @IsNotEmpty()
  carrierId: number; // ID đơn vị vận chuyển - nhập ở 4.2.1

  @IsString()
  @IsNotEmpty()
  carrierName: string; // Tên đơn vị vận chuyển - nhập ở 4.2.1

  @IsNumber()
  @IsNotEmpty()
  supplierId: number; // ID nhà cung cấp - nhập ở 4.2.1

  @IsString()
  @IsNotEmpty()
  supplierName: string; // Tên nhà cung cấp - nhập ở 4.2.1

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  importDate: Date; // Ngày nhập kho - nhập ở 4.2.1

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDetailDTO)
  details: CreateTransactionDetailDTO[]; // Danh sách sản phẩm - thêm ở 4.3.3

  @IsString()
  @IsOptional()
  notes?: string; // Ghi chú - nhập ở 4.2.1

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number; // Tổng tiền tự động tính toán từ danh sách sản phẩm - nhập ở 4.2.1
}
