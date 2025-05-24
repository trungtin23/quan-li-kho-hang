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

// [4.1] DTO tạo mới phiếu nhập kho
export class CreateImportTransactionDTO {
  @IsString()
  @IsNotEmpty()
  transactionCode: string; // [4.1] Mã phiếu nhập (VD: NK001)

  @IsNumber()
  @IsNotEmpty()
  userId: number; // [4.1] ID nhân viên

  @IsString()
  @IsNotEmpty()
  employeeName: string; // [4.1] Tên nhân viên

  @IsNumber()
  @IsNotEmpty()
  carrierId: number; // [4.1] ID đơn vị vận chuyển

  @IsString()
  @IsNotEmpty()
  carrierName: string; // [4.1] Tên đơn vị vận chuyển

  @IsNumber()
  @IsNotEmpty()
  supplierId: number; // [4.1] ID nhà cung cấp

  @IsString()
  @IsNotEmpty()
  supplierName: string; // [4.1] Tên nhà cung cấp

  @IsDate()
  @IsNotEmpty()
  @Type(() => Date)
  importDate: Date; // [4.1] Ngày nhập kho

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateTransactionDetailDTO)
  details: CreateTransactionDetailDTO[]; // [4.2] Danh sách sản phẩm

  @IsString()
  @IsOptional()
  notes?: string; // [4.1] Ghi chú

  @IsNumber()
  @IsNotEmpty()
  totalAmount: number; // [4.1] Tổng tiền
}
