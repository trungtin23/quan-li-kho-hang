import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDetail } from '../entities/transaction-detail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Warehouse } from '../entities/warehouse.entity';
import {
  CreateInventoryCheckDTO,
  CompleteInventoryCheckDTO,
} from './dto/create-inventory-check.dto';

@Injectable()
export class InventoryCheckService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    @InjectRepository(TransactionDetail)
    private transactionDetailRepository: Repository<TransactionDetail>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Warehouse)
    private warehouseRepository: Repository<Warehouse>,
  ) {}

  // Truy vấn các phiếu kiểm kê
  async getAllInventoryChecks(): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { type: 'INVENTORY_CHECK' },
      relations: ['user', 'transactionDetails', 'transactionDetails.product'],
    });
  }

  // [2.3 & 1.8] Lấy thông tin chi tiết phiếu kiểm kê
  async getInventoryCheckById(id: number): Promise<Transaction> {
    const check = await this.transactionRepository.findOne({
      where: { transactionId: id, type: 'INVENTORY_CHECK' },
      relations: ['user', 'transactionDetails', 'transactionDetails.product'],
    });

    if (!check) {
      throw new NotFoundException(`Phiếu kiểm kê với ID ${id} không tồn tại`);
    }

    return check;
  }

  // [1.2] Tạo phiếu kiểm kê mới
  async createInventoryCheck(
    createDto: CreateInventoryCheckDTO,
  ): Promise<Transaction> {
    // [1.3] Kiểm tra user 
    const user = await this.userRepository.findOne({
      where: { userId: createDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với ID ${createDto.userId}`,
      );
    }

    // [1.4] Kiểm tra warehouse
    const warehouse = await this.warehouseRepository.findOne({
      where: { warehouseId: createDto.warehouseId },
    });
    if (!warehouse) {
      throw new NotFoundException(
        `Không tìm thấy kho với ID ${createDto.warehouseId}`,
      );
    }

    // [1.5] Tạo phiếu kiểm kê mới (sử dụng bảng Transaction)
    const newInventoryCheck = this.transactionRepository.create({
      userId: user.userId,
      carrierId: 1, // Giá trị mặc định vì bắt buộc
      supplierId: 1, // Giá trị mặc định vì bắt buộc
      transactionDate: createDto.checkDate || new Date(),
      status: 'DRAFT', // Trạng thái ban đầu
      type: 'INVENTORY_CHECK', // Loại phiếu kiểm kê
      totalPrice: 0, // Không liên quan đến phiếu kiểm kê
    });

    // [1.5] Lưu phiếu kiểm kê
    const savedInventoryCheck =
      await this.transactionRepository.save(newInventoryCheck);

    // [1.6] Lấy danh sách sản phẩm trong kho để kiểm kê
    const products = await this.productRepository.find({
      where: { warehouseId: warehouse.warehouseId },
      relations: ['slot'],
    });

    // [1.7] Tạo chi tiết kiểm kê cho từng sản phẩm
    if (products.length > 0) {
      const transactionDetails = products.map((product) => {
        return this.transactionDetailRepository.create({
          transactionId: savedInventoryCheck.transactionId,
          productId: product.productId,
          quantity: product.stock, // Số lượng dự kiến là số lượng trong hệ thống
        });
      });

      // [1.7] Lưu chi tiết kiểm kê
      await this.transactionDetailRepository.save(transactionDetails);
    }

    // [1.8] Trả về phiếu kiểm kê đã tạo kèm thông tin đầy đủ
    return this.getInventoryCheckById(savedInventoryCheck.transactionId);
  }

  // [2.2] Hoàn thành phiếu kiểm kê
  async completeInventoryCheck(
    completeDto: CompleteInventoryCheckDTO,
  ): Promise<Transaction> {
    // [2.3] Lấy phiếu kiểm kê
    const inventoryCheck = await this.getInventoryCheckById(
      completeDto.transactionId,
    );

    // [2.4] Cập nhật trạng thái
    inventoryCheck.status = completeDto.status || 'COMPLETED';
    await this.transactionRepository.save(inventoryCheck);

    // [2.5] Cập nhật số lượng thực tế cho từng sản phẩm
    for (const detail of completeDto.details) {
      // [2.5] Tìm chi tiết kiểm kê
      const existingDetail = await this.transactionDetailRepository.findOne({
        where: {
          transactionId: inventoryCheck.transactionId,
          productId: detail.productId,
        },
      });

      if (existingDetail) {
        // Số lượng ban đầu là số lượng dự kiến
        const expectedQuantity = existingDetail.quantity;
        
        // [2.6] Cập nhật số lượng thực tế
        existingDetail.quantity = detail.actualQuantity;
        await this.transactionDetailRepository.save(existingDetail);

        // [2.7] Nếu có chênh lệch, cần điều chỉnh stock trong bảng Product
        const product = await this.productRepository.findOne({
          where: { productId: detail.productId },
        });

        if (product && detail.actualQuantity !== expectedQuantity) {
          // [2.7] Cập nhật lại số lượng thực tế trong kho
          product.stock = detail.actualQuantity;
          await this.productRepository.save(product);
        }
      }
    }

    // [2.8] Trả về phiếu kiểm kê đã hoàn thành
    return this.getInventoryCheckById(inventoryCheck.transactionId);
  }
}
