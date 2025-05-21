import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { Transaction } from '../entities/transaction.entity';
import { InventoryCheckService } from './inventory-check.service';
import {
  CompleteInventoryCheckDTO,
  CreateInventoryCheckDTO,
} from './dto/create-inventory-check.dto';

@Controller('inventory-checks')
export class InventoryCheckController {
  constructor(private readonly inventoryCheckService: InventoryCheckService) {}

  @Get()
  async getAllInventoryChecks(): Promise<Transaction[]> {
    return this.inventoryCheckService.getAllInventoryChecks();
  }

  @Get(':id')
  async getInventoryCheckById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Transaction> {
    return this.inventoryCheckService.getInventoryCheckById(id);
  }

  // [1.1] API tạo phiếu kiểm kê mới
  @Post()
  async createInventoryCheck(
    @Body() createDto: CreateInventoryCheckDTO,
  ): Promise<Transaction> {
    // [1.2] Gọi service để tạo phiếu kiểm kê
    return this.inventoryCheckService.createInventoryCheck(createDto);
  }

  // [2.1] API hoàn thành phiếu kiểm kê
  @Post('complete')
  async completeInventoryCheck(
    @Body() completeDto: CompleteInventoryCheckDTO,
  ): Promise<Transaction> {
    // [2.2] Gọi service để hoàn thành phiếu kiểm kê
    return this.inventoryCheckService.completeInventoryCheck(completeDto);
  }
}
