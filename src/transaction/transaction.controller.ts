// src/transaction/transaction.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { Transaction } from '../entities/transaction.entity';
import { TransactionService } from './transaction.service';
import { CreateImportTransactionDTO } from './dto/create-transaction.dto';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  // Lấy tất cả transactions với filter theo type
  @Get()
  async getAllTransactions(
    @Query('type') type?: string,
  ): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions(type);
  }

  // Lấy danh sách phiếu nhập kho
  @Get('imports')
  async getImportTransactions(): Promise<Transaction[]> {
    return this.transactionService.getTransactionsByType('IMPORT');
  }

  @Get(':id')
  async getTransactionById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Transaction> {
    return this.transactionService.getTransactionById(id);
  }

  // 4.4.3: POST /transactions/import - API tạo phiếu nhập kho
  @Post('import')
  async createImportTransaction(
    @Body() createDto: CreateImportTransactionDTO,
  ): Promise<Transaction> {
    try {
      // 4.4.4: createImportTransaction(createDto) - Gọi service để tạo phiếu nhập kho
      console.log('4.4.4: Gọi service createImportTransaction');
      const result =
        await this.transactionService.createImportTransaction(createDto);

      // 4.4.34: Return success response với Transaction data
      console.log('4.4.34: Return success response với Transaction data');
      return result;
    } catch (error) {
      // 4.4.24: Return error response
      console.error('4.4.24: Return error response:', error.message);
      throw error;
    }
  }
}
