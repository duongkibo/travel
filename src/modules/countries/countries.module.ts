import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaEntity } from '../media/entities/media.entity';
import { MediaRepository } from '../media/repositories/media.repository';
import { MediaService } from '../media/services/media.service';
import { CountriesController } from './countries.controller';
import { CountryRepository } from './countries.repository';
import { CountriesService } from './countries.service';

@Module({
  controllers: [CountriesController],
  providers: [CountriesService, MediaService],
  imports: [
    TypeOrmModule.forFeature([
      CountryRepository,
      MediaRepository,
      MediaEntity,
    ]),
  ],
})
export class CountriesModule {}
