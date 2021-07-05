import { EntityRepository } from 'typeorm';;
import { CommonRepository } from 'src/modules/common/common.repository';
import { PaymentCard, TouristArea, UserBookTour, UserLocation } from './tourist-area.entity';
// import { Countries } from './countries.entity';

@EntityRepository(TouristArea)
export class TouristAreaRepository extends CommonRepository<TouristArea> {}

@EntityRepository(UserBookTour)
export class UserBookTourRepository extends CommonRepository<UserBookTour> {}

@EntityRepository(PaymentCard)
export class PaymentCardRepository extends CommonRepository<PaymentCard> {}

@EntityRepository(UserLocation)
export class UserLocationRepository extends CommonRepository<UserLocation> {}
