import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDetail } from '../entities/transaction-detail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Warehouse } from '../entities/warehouse.entity';
import { Supplier } from '../entities/supplier.entity';
import { Carrier } from '../entities/carrier.entity';
import { CreateImportTransactionDTO } from './dto/create-transaction.dto';
import { CreateTransactionDetailDTO } from '../transaction-detail/dto/create-transaction-detail.dto';

@Injectable()
export class TransactionService {
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
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Carrier)
    private carrierRepository: Repository<Carrier>,
  ) {}

  // [4.1] Lấy tất cả transactions
  async getAllTransactions(type?: string): Promise<Transaction[]> {
    const whereCondition = type ? { type: type.toUpperCase() } : {};

    return this.transactionRepository.find({
      where: whereCondition,
      relations: [
        'user',
        'supplier',
        'carrier',
        'transactionDetails',
        'transactionDetails.product',
      ],
      order: { transactionDate: 'DESC' },
    });
  }

  // [4.1] Lấy transactions theo type
  async getTransactionsByType(type: string): Promise<Transaction[]> {
    return this.transactionRepository.find({
      where: { type: type.toUpperCase() },
      relations: [
        'user',
        'supplier',
        'carrier',
        'transactionDetails',
        'transactionDetails.product',
      ],
      order: { transactionDate: 'DESC' },
    });
  }

  // [4.3 & 4.8] Lấy thông tin chi tiết transaction
  async getTransactionById(id: number): Promise<Transaction> {
    const transaction = await this.transactionRepository.findOne({
      where: { transactionId: id },
      relations: [
        'user',
        'supplier',
        'carrier',
        'transactionDetails',
        'transactionDetails.product',
      ],
    });

    if (!transaction) {
      throw new NotFoundException(`Transaction với ID ${id} không tồn tại`);
    }

    return transaction;
  }

  // [4.2] Tạo phiếu nhập kho
  async createImportTransaction(
    createDto: CreateImportTransactionDTO,
  ): Promise<Transaction> {
    // [4.3] Kiểm tra user
    const user = await this.userRepository.findOne({
      where: { userId: createDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với ID ${createDto.userId}`,
      );
    }

    // [4.4] Kiểm tra supplier
    const supplier = await this.supplierRepository.findOne({
      where: { supplierId: createDto.supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(
        `Không tìm thấy nhà cung cấp với ID ${createDto.supplierId}`,
      );
    }

    // [4.4] Kiểm tra carrier
    const carrier = await this.carrierRepository.findOne({
      where: { carrierId: createDto.carrierId },
    });
    if (!carrier) {
      throw new NotFoundException(
        `Không tìm thấy đơn vị vận chuyển với ID ${createDto.carrierId}`,
      );
    }

    // [4.4] Kiểm tra danh sách sản phẩm không rỗng
    if (!createDto.details || createDto.details.length === 0) {
      throw new BadRequestException('Danh sách sản phẩm không được rỗng');
    }

    // [4.5] Tạo transaction mới
    const newTransaction = this.transactionRepository.create({
      userId: user.userId,
      carrierId: carrier.carrierId,
      supplierId: supplier.supplierId,
      transactionDate: createDto.importDate,
      status: 'COMPLETED', // [4.5] Trạng thái hoàn thành vì đã nhập đầy đủ thông tin
      type: 'IMPORT', // [4.5] Loại phiếu nhập kho
      totalPrice: createDto.totalAmount,
    });

    // [4.5] Lưu transaction
    const savedTransaction =
      await this.transactionRepository.save(newTransaction);

    // [4.6] Tạo chi tiết transaction và cập nhật sản phẩm
    for (const productDetail of createDto.details) {
      // [4.6] Tìm hoặc tạo sản phẩm
      let product = await this.productRepository.findOne({
        where: { productId: productDetail.productId },
      });

      if (product) {
        // [4.7] Nếu sản phẩm đã tồn tại, cập nhật số lượng và thông tin
        product.stock += productDetail.quantity;
        product.price = productDetail.price;
        product.productName = productDetail.productName;
        product.description = productDetail.description || product.description;
        product.timeReceive = new Date();
      } else {
        // [4.7] Nếu sản phẩm chưa tồn tại, tạo mới (cần có thêm thông tin warehouse và slot)
        throw new NotFoundException(
          `Sản phẩm với ID ${productDetail.productId} không tồn tại. Vui lòng tạo sản phẩm trước khi nhập kho.`,
        );
      }

      await this.productRepository.save(product);

      // [4.6] Tạo chi tiết giao dịch
      const transactionDetail = this.transactionDetailRepository.create({
        transactionId: savedTransaction.transactionId,
        productId: productDetail.productId,
        quantity: productDetail.quantity,
      });

      await this.transactionDetailRepository.save(transactionDetail);
    }

    // [4.8] Trả về transaction đã tạo kèm thông tin đầy đủ
    return this.getTransactionById(savedTransaction.transactionId);
  }
}
