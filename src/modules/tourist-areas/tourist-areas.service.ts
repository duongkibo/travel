import { Injectable, NotFoundException } from '@nestjs/common';
import { getConnection } from 'typeorm';
import { MediaService } from '../media/services/media.service';
import { TouristAreaRepository } from './touries-area.repository';
import { NewAreaInput } from './tourisr-area.input';
import { TouristArea } from './tourist-area.entity';

@Injectable()
export class TouristAreasService {
    constructor(private readonly areaRepository: TouristAreaRepository, private readonly mediaService: MediaService){}

    createArea = async (input: NewAreaInput) =>  {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const newCity = new TouristArea({
          areaName: input.areaName,
          cityId: input.cityId,
          price: input.price,
          description: input.description
        });
        try {
         
            newCity.areaMedias = await this.mediaService.getMedias(input.imageId);
          const createNewCity = await queryRunner.manager.save(newCity);
          await queryRunner.commitTransaction();
          return createNewCity;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new Error(error || 'save_unsuccessfully');
        } finally {
          await queryRunner.release();
        }
      }
    
      updateArea = async (input: NewAreaInput, id: string) =>  {
        const findCountry = this.areaRepository.findOne(id)
        if (!findCountry) throw new NotFoundException('Not found'); ;
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const updateCountry = new TouristArea({
            areaName: input.areaName,
            cityId: input.cityId,
            price: input.price,
          description: input.description
        });
        try {
          await this.areaRepository.delete(id);
          updateCountry.areaMedias = await this.mediaService.getMedias(input.imageId);
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

      delete = async (id: string) =>  {
        const findCountry = await this.areaRepository.findOne(id);
        if (!findCountry)    throw new NotFoundException('Not found'); 
        await this.areaRepository.delete(id);
        return true;
      }

      getById = async (id: string) => {
        const aliasBuilder = 'tourist_areas';
        const queryBuilder = this.areaRepository.createQueryBuilder(aliasBuilder);
        queryBuilder.leftJoinAndSelect('tourist_areas.areaMedias', 'media');
        queryBuilder.leftJoinAndSelect('tourist_areas.cities', 'cities');
        queryBuilder.leftJoinAndSelect('cities.countries', 'countries');
        // queryBuilder.leftJoinAndSelect('countries.countries', 'country');
        queryBuilder.andWhere(`tourist_areas.id = '${id}'`);
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return queryBuilder.getOne();
      }

      searchAreas = async (areaName: string | undefined, page: number | undefined, limit: number | undefined) => {
        limit = limit || 20;
        page = page || 1;
        const aliasBuilder = 'tourist_areas';
        const queryBuilder = this.areaRepository.createQueryBuilder(aliasBuilder);
        if (areaName && areaName.length > 0) {
          queryBuilder.orWhere(`${aliasBuilder}.area_name ILIKE :NAME`, { NAME: `%${areaName}%` });
        }
        queryBuilder.leftJoinAndSelect('tourist_areas.areaMedias', 'media');
        queryBuilder.leftJoinAndSelect('tourist_areas.cities', 'cities');
        queryBuilder.leftJoinAndSelect('cities.countries', 'countries');
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return await this.areaRepository.customPaginate(queryBuilder, { limit, page });
      };

      findByCityId = async (id: string) => {
        const find =  await this.areaRepository.findOne({ cityId: id});
        if (find) return true;
        return false;
      }
}
