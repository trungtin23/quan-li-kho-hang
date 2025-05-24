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

  // [4.3] Lấy tất cả transactions với filter theo type
  @Get()
  async getAllTransactions(
    @Query('type') type?: string,
  ): Promise<Transaction[]> {
    return this.transactionService.getAllTransactions(type);
  }

  // [4.3] Lấy danh sách phiếu nhập kho
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

  // [4.4] API tạo phiếu nhập kho
  @Post('import')
  async createImportTransaction(
    @Body() createDto: CreateImportTransactionDTO,
  ): Promise<Transaction> {
    // [4.2] Gọi service để tạo phiếu nhập kho
    return this.transactionService.createImportTransaction(createDto);
  }
}
