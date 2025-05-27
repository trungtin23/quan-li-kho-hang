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

  //Lấy tất cả transactions
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

  // Lấy transactions theo type
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

  // 4.4.30 & 4.4.31: getTransactionById() để lấy đầy đủ thông tin
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

    // 4.4.32: Return complete Transaction data
    console.log('4.4.32: Return complete Transaction data');
    return transaction;
  }

  // 4.4.4: Tạo phiếu nhập kho
  async createImportTransaction(
    createDto: CreateImportTransactionDTO,
  ): Promise<Transaction> {
    // 4.4.5: Kiểm tra User exists
    const user = await this.userRepository.findOne({
      where: { userId: createDto.userId },
    });
    if (!user) {
      throw new NotFoundException(
        `Không tìm thấy người dùng với ID ${createDto.userId}`,
      );
    }
    // 4.4.6: Return User data
    console.log('4.4.6: Return User data');

    // 4.4.7: Kiểm tra Supplier exists
    const supplier = await this.supplierRepository.findOne({
      where: { supplierId: createDto.supplierId },
    });
    if (!supplier) {
      throw new NotFoundException(
        `Không tìm thấy nhà cung cấp với ID ${createDto.supplierId}`,
      );
    }
    // 4.4.8: Return Supplier data
    console.log('4.4.8: Return Supplier data');

    // 4.4.9: Kiểm tra Carrier exists
    console.log('4.4.9: Kiểm tra Carrier exists');
    const carrier = await this.carrierRepository.findOne({
      where: { carrierId: createDto.carrierId },
    });
    if (!carrier) {
      throw new NotFoundException(
        `Không tìm thấy đơn vị vận chuyển với ID ${createDto.carrierId}`,
      );
    }
    // 4.4.10: Return Carrier data
    console.log('4.4.10: Return Carrier data');

    // 4.4.11: Validate danh sách sản phẩm không rỗng
    console.log('4.4.11: Validate danh sách sản phẩm không rỗng');
    if (!createDto.details || createDto.details.length === 0) {
      throw new BadRequestException('Danh sách sản phẩm không được rỗng');
    }

    // 4.4.12: Tạo Transaction object
    console.log('4.4.12: Tạo Transaction object');
    const newTransaction = this.transactionRepository.create({
      userId: user.userId,
      carrierId: carrier.carrierId,
      supplierId: supplier.supplierId,
      transactionDate: createDto.importDate,
      status: 'COMPLETED', // Trạng thái hoàn thành vì đã nhập đầy đủ thông tin
      type: 'IMPORT', // Loại phiếu nhập kho
      totalPrice: createDto.totalAmount,
    });

    // 4.4.13: Save Transaction
    console.log('4.4.13: Save Transaction');
    const savedTransaction =
      await this.transactionRepository.save(newTransaction);

    // 4.4.14 & 4.4.15: Return saved Transaction với ID
    console.log(
      '4.4.14 & 4.4.15: Return Transaction với ID:',
      savedTransaction.transactionId,
    );

    // Loop qua từng sản phẩm trong details
    for (const productDetail of createDto.details) {
      // 4.4.16: Tìm Product theo productId
      console.log(
        '4.4.16: Tìm Product theo productId:',
        productDetail.productId,
      );
      let product = await this.productRepository.findOne({
        where: { productId: productDetail.productId },
      });

      if (product) {
        // 4.4.17: Return Product data
        console.log('4.4.17: Return Product data');

        // 4.4.18: Cập nhật stock += quantity
        console.log('4.4.18: Cập nhật stock += quantity');
        product.stock += productDetail.quantity;

        // 4.4.19: Cập nhật price, productName, description
        console.log('4.4.19: Cập nhật price, productName, description');
        product.price = productDetail.price;
        product.productName = productDetail.productName;
        product.description = productDetail.description || product.description;

        // 4.4.20: Cập nhật timeReceive = now()
        console.log('4.4.20: Cập nhật timeReceive = now()');
        product.timeReceive = new Date();

        // 4.4.21: Save updated Product
        console.log('4.4.21: Save updated Product');
        await this.productRepository.save(product);

        // 4.4.22: Confirm Product saved
        console.log('4.4.22: Confirm Product saved');
      } else {
        // 4.4.23: Throw NotFoundException
        console.log('4.4.23: Throw NotFoundException - Sản phẩm không tồn tại');
        throw new NotFoundException(
          `Sản phẩm với ID ${productDetail.productId} không tồn tại. Vui lòng tạo sản phẩm trước khi nhập kho.`,
        );
      }

      // 4.4.26: Tạo TransactionDetail object
      console.log('4.4.26: Tạo TransactionDetail object');
      const transactionDetail = this.transactionDetailRepository.create({
        transactionId: savedTransaction.transactionId,
        productId: productDetail.productId,
        quantity: productDetail.quantity,
      });

      // 4.4.27: Save TransactionDetail
      console.log('4.4.27: Save TransactionDetail');
      await this.transactionDetailRepository.save(transactionDetail);

      // 4.4.28 & 4.4.29: Confirm TransactionDetail saved
      console.log('4.4.28 & 4.4.29: Confirm TransactionDetail saved');
    }

    // 4.4.30: getTransactionById() để lấy đầy đủ thông tin
    console.log('4.4.30: getTransactionById() để lấy đầy đủ thông tin');
    const completeTransaction = await this.getTransactionById(
      savedTransaction.transactionId,
    );

    // 4.4.33: Return complete Transaction
    console.log('4.4.33: Return complete Transaction');
    return completeTransaction;
  }
}
