import { Injectable, NotFoundException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { MediaService } from '../media/services/media.service';
import { Countries } from './countries.entity';
import { CountryRepository } from './countries.repository';
import { NewCountryInput } from './dto/country_input';

@Injectable()
export class CountriesService {
constructor(private readonly countryRepository: CountryRepository,
    private readonly mediaService: MediaService){}

createCountry = async (input: NewCountryInput) =>  {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const newCountry = new Countries({
      countryName: input.countryName,
      description: input.description
    });
    try {
     
      newCountry.countryMedias = await this.mediaService.getMedias(input.imageId);
      const createNewCountry = await queryRunner.manager.save(newCountry);
      await queryRunner.commitTransaction();
      return createNewCountry;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error || 'save_unsuccessfully');
    } finally {
      await queryRunner.release();
    }
  }

  findOne = async (id: string): Promise<Countries | undefined> => {
    return await this.countryRepository.findOneOrFail({ where: { id } });
  };

  delete = async (id: string) =>  {
    const findCountry = await this.findOne(id);
    if (!findCountry)    throw new NotFoundException('Not found'); 
    await this.countryRepository.delete(id);
    return true;
  }

  getById = async (id: string) => {
    const aliasBuilder = 'countries';
    const queryBuilder = this.countryRepository.createQueryBuilder(aliasBuilder);
    queryBuilder.leftJoinAndSelect('countries.countryMedias', 'media');
    // queryBuilder.leftJoinAndSelect('countries.countries', 'country');
    queryBuilder.andWhere(`countries.id = '${id}'`);
    queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
    return queryBuilder.getOne();
  }

  updateCountry = async (input: NewCountryInput, id: string) =>  {
    const findCountry = this.findOne(id)
    if (!findCountry) throw new NotFoundException('Not found'); ;
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const updateCountry = new Countries({
      countryName: input.countryName,
      description: input.description
    });
    try {
      await this.countryRepository.delete(id);
      updateCountry.countryMedias = await this.mediaService.getMedias(input.imageId);
      const createNewProduct = await queryRunner.manager.save(updateCountry);
      await queryRunner.commitTransaction();
      return createNewProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error || 'save_unsuccessfully');
    } finally {
      await queryRunner.release();
    }
  }

  searchCountry = async (countryName: string | undefined, page: number | undefined, limit: number | undefined) => {
    limit = limit || 20;
    page = page || 1;
    const aliasBuilder = 'countries';
    const queryBuilder = this.countryRepository.createQueryBuilder(aliasBuilder);
    if (countryName && countryName.length > 0) {
      queryBuilder.orWhere(`${aliasBuilder}.country_name ILIKE :NAME`, { NAME: `%${countryName}%` });
    }
    queryBuilder.leftJoinAndSelect('countries.countryMedias', 'media');
    queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
    return await this.countryRepository.customPaginate(queryBuilder, { limit, page });
  };


}



