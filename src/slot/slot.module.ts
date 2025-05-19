import { Module } from '@nestjs/common';
import { SlotService } from './slot.service';
import { SlotController } from './slot.controller';
import { Slot } from './entities/slot.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Slot])],
  controllers: [SlotController],
  providers: [SlotService],
  exports: [SlotService]
})
export class SlotModule {}
