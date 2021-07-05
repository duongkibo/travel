import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '../media/entities/media.entity';
import { MediaRepository } from '../media/repositories/media.repository';
import { MediaService } from '../media/services/media.service';
import {  HotelRateRepository, HotelRepository, UserBookHotelRepository } from './hotel.repository';
import { HotelsController } from './hotel.controller';
import { HotelService } from './hotel.service';

@Module({
  controllers: [HotelsController],
  providers: [HotelService, MediaService],
  imports: [
    TypeOrmModule.forFeature([
      HotelRepository,
      MediaRepository,
      MediaEntity,
      HotelRateRepository,
      UserBookHotelRepository
    ]),
  ],
  exports: [HotelService]
})
export class HotelModule {}
