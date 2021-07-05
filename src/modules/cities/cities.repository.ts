import { EntityRepository } from 'typeorm';;
import { CommonRepository } from 'src/modules/common/common.repository';
// import { Countries } from './countries.entity';
import { Cities } from './citites.entity';

@EntityRepository(Cities)
export class CitiesRepository extends CommonRepository<Cities> {}
