import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Transaction } from '../entities/transaction.entity';
import { TransactionDetail } from '../entities/transaction-detail.entity';
import { Product } from '../entities/product.entity';
import { User } from '../entities/user.entity';
import { Supplier } from '../entities/supplier.entity';
import { Carrier } from '../entities/carrier.entity';
import { Repository } from 'typeorm';
import { CreateImportTransactionDTO } from './dto/create-transaction.dto';

describe('TransactionService', () => {
  let service: TransactionService;

  // Mocks
  let transactionRepo: Repository<Transaction>;
  let transactionDetailRepo: Repository<TransactionDetail>;
  let productRepo: Repository<Product>;
  let userRepo: Repository<User>;
  let supplierRepo: Repository<Supplier>;
  let carrierRepo: Repository<Carrier>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useValue: createMockRepo(),
        },
        {
          provide: getRepositoryToken(TransactionDetail),
          useValue: createMockRepo(),
        },
        { provide: getRepositoryToken(Product), useValue: createMockRepo() },
        { provide: getRepositoryToken(User), useValue: createMockRepo() },
        { provide: getRepositoryToken(Supplier), useValue: createMockRepo() },
        { provide: getRepositoryToken(Carrier), useValue: createMockRepo() },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    transactionRepo = module.get(getRepositoryToken(Transaction));
    transactionDetailRepo = module.get(getRepositoryToken(TransactionDetail));
    productRepo = module.get(getRepositoryToken(Product));
    userRepo = module.get(getRepositoryToken(User));
    supplierRepo = module.get(getRepositoryToken(Supplier));
    carrierRepo = module.get(getRepositoryToken(Carrier));
  });

  it('should create an import transaction successfully', async () => {
    const dto: CreateImportTransactionDTO = {
      transactionCode: 'NK001',
      userId: 1,
      employeeName: 'John Doe',
      carrierId: 2,
      carrierName: 'VNPost',
      supplierId: 3,
      supplierName: 'Vinamilk',
      importDate: new Date(),
      details: [
        {
          productId: 1,
          productName: 'Sữa tươi',
          quantity: 10,
          price: 20000,
          description: 'Sữa hộp 1L',
        },
      ],
      notes: 'Đơn hàng test',
      totalAmount: 200000,
    };

    // Setup mocks
    (userRepo.findOne as any).mockResolvedValue({ userId: 1 });
    (supplierRepo.findOne as any).mockResolvedValue({ supplierId: 3 });
    (carrierRepo.findOne as any).mockResolvedValue({ carrierId: 2 });

    const product = {
      productId: 1,
      stock: 50,
      price: 15000,
      productName: 'Sữa tươi',
      description: 'TH true milk',
      timeReceive: new Date(),
    };
    (productRepo.findOne as any).mockResolvedValue(product);
    (productRepo.save as any).mockResolvedValue({ ...product, stock: 60 });

    const savedTransaction = { transactionId: 10, ...dto };
    (transactionRepo.create as any).mockReturnValue(dto);
    (transactionRepo.save as any).mockResolvedValue(savedTransaction);
    (transactionDetailRepo.save as any).mockResolvedValue({});

    (transactionRepo.findOne as any).mockResolvedValue(savedTransaction);

    const result = await service.createImportTransaction(dto);

    expect(result).toEqual(savedTransaction);
    expect(userRepo.findOne).toHaveBeenCalledWith({
      where: { userId: dto.userId },
    });
    expect(productRepo.save).toHaveBeenCalled();
    expect(transactionDetailRepo.save).toHaveBeenCalled();
  });
});

function createMockRepo() {
  return {
    findOne: jest.fn(),
    find: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
  };
}
