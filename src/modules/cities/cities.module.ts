import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HotelModule } from '../hotels/hotel.module';
import { MediaEntity } from '../media/entities/media.entity';
import { MediaRepository } from '../media/repositories/media.repository';
import { MediaService } from '../media/services/media.service';
import { TouristArea } from '../tourist-areas/tourist-area.entity';
import { TouristAreasModule } from '../tourist-areas/tourist-areas.module';
import { CitiesController } from './cities.controller';
import { CitiesRepository } from './cities.repository';
import { CitiesService } from './cities.service';

@Module({
  controllers: [CitiesController],
  providers: [CitiesService, MediaService],
  imports: [
    TypeOrmModule.forFeature([
      CitiesRepository,
      MediaRepository,
      MediaEntity,
    ]),
    forwardRef(() => HotelModule),
    forwardRef(() => TouristAreasModule),
  ],
})
export class CitiesModule {}
