import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthTokenEntity } from './modules/auth/entities/auth.entity';
import { Cities } from './modules/cities/citites.entity';
import { Countries } from './modules/countries/countries.entity';
import {  Hotels, HotelsRates, UserBookHotel } from './modules/hotels/hotel.entity';
import { MediaEntity } from './modules/media/entities/media.entity';
import { PaymentCard, TouristArea, UserBookTour, UserLocation } from './modules/tourist-areas/tourist-area.entity';
import { User } from './modules/users/entities/users.entity';
import { Sample } from './sample/entities/sample.entity';

export const typeORMConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DATABASE,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  entities: [User, MediaEntity, AuthTokenEntity, Sample, Countries, Cities, TouristArea, Hotels, HotelsRates, UserBookTour, UserBookHotel, PaymentCard, UserLocation],
  logging: process.env.DATABASE_LOGGING === 'true',
};
