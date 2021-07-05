import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '../media/entities/media.entity';
import { MediaRepository } from '../media/repositories/media.repository';
import { MediaService } from '../media/services/media.service';
import { PaymentCardRepository, TouristAreaRepository, UserBookTourRepository, UserLocationRepository } from './touries-area.repository';
import { TouristAreasController } from './tourist-areas.controller';
import { TouristAreasService } from './tourist-areas.service';
import { UserBookTourController } from './user-book-tour.controller';
import { UserBookTourService } from './user-book-tour.service';

@Module({
  controllers: [TouristAreasController, UserBookTourController],
  providers: [TouristAreasService, MediaService, UserBookTourService],
  imports: [
    TypeOrmModule.forFeature([
      TouristAreaRepository,
      MediaRepository,
      MediaEntity,
      UserBookTourRepository,
      PaymentCardRepository,
      UserLocationRepository
    ]),
  ],
  exports: [UserBookTourService, TouristAreasService]
})
export class TouristAreasModule {}
