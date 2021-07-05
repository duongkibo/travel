import { EntityRepository } from 'typeorm';
import { CommonRepository } from 'src/modules/common/common.repository';
import {  Hotels, HotelsRates, UserBookHotel } from './hotel.entity';
// import { Countries } from './countries.entity';

@EntityRepository(Hotels)
export class HotelRepository extends CommonRepository<Hotels> {}

@EntityRepository(HotelsRates)
export class HotelRateRepository extends CommonRepository<HotelsRates> {}


@EntityRepository(UserBookHotel)
export class UserBookHotelRepository extends CommonRepository<UserBookHotel> {}

