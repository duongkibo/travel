import { EntityRepository } from 'typeorm';;
import { CommonRepository } from 'src/modules/common/common.repository';
import { Countries } from './countries.entity';

@EntityRepository(Countries)
export class CountryRepository extends CommonRepository<Countries> {}
