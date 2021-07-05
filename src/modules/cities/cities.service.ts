import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { query } from 'express';
import { getConnection } from 'typeorm';
import { HotelService } from '../hotels/hotel.service';
import { MediaService } from '../media/services/media.service';
import { TouristAreasService } from '../tourist-areas/tourist-areas.service';
import { CitiesController } from './cities.controller';
import { CitiesRepository } from './cities.repository';
import { Cities } from './citites.entity';
import { NewCityInput } from './city.dto';

@Injectable()
export class CitiesService {
    constructor(private readonly cityRepository: CitiesRepository, private readonly mediaService: MediaService,
      private readonly hotelService: HotelService,
      private readonly areaService: TouristAreasService){}
    createCountry = async (input: NewCityInput) =>  {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const newCity = new Cities({
          cityName: input.cityName,
          countryId: input.countryId
        });
        try {
         
            newCity.cityMedias = await this.mediaService.getMedias(input.imageId);
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
    
      findOne = async (id: string): Promise<Cities | undefined> => {
        return await this.cityRepository.findOneOrFail({ where: { id } });
      };
      
      getById = async (id: string) => {
        const aliasBuilder = 'cities';
        const queryBuilder = this.cityRepository.createQueryBuilder(aliasBuilder);
        queryBuilder.leftJoinAndSelect('cities.cityMedias', 'media');
        queryBuilder.leftJoinAndSelect('cities.countries', 'country');
        queryBuilder.andWhere(`cities.id = '${id}'`);
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return queryBuilder.getOne();
      }
    
      delete = async (id: string) =>  {
        const findCountry = await this.findOne(id);
        if (!findCountry)    throw new NotFoundException('Not found'); 
        const findHotel = await this.hotelService.findByCityId(id);
        if (findHotel) throw new BadRequestException('CANNOT_DELETE');
        const findArea = await this.areaService.findByCityId(id);
        if (findArea) throw new BadRequestException('CANNOT_DELETE');
        await this.cityRepository.delete(id);
        return true;
      }
    
      updateCountry = async (input: NewCityInput, id: string) =>  {
        const findCountry = await  this.findOne(id)
        if (!findCountry) throw new NotFoundException('Not found'); ;
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
        findCountry.cityName = input.cityName;
        findCountry.countryId = input.countryId;
     
        try {
          // await this.cityRepository.delete(id);
          findCountry.cityMedias = await this.mediaService.getMedias(input.imageId);
          const createNewProduct = await queryRunner.manager.save(findCountry);
          await queryRunner.commitTransaction();
          return createNewProduct;
        } catch (error) {
          await queryRunner.rollbackTransaction();
          throw new Error(error || 'save_unsuccessfully');
        } finally {
          await queryRunner.release();
        }
      }
    
      searchCity = async (countryName: string | undefined, page: number | undefined, limit: number | undefined) => {
        limit = limit || 20;
        page = page || 1;
        const aliasBuilder = 'cities';
        const queryBuilder = this.cityRepository.createQueryBuilder(aliasBuilder);
        if (countryName && countryName.length > 0) {
          queryBuilder.orWhere(`${aliasBuilder}.country_name ILIKE :NAME`, { NAME: `%${countryName}%` });
        }
        queryBuilder.leftJoinAndSelect('cities.cityMedias', 'media');
        queryBuilder.leftJoinAndSelect('cities.countries', 'country');
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return await this.cityRepository.customPaginate(queryBuilder, { limit, page });
      };
}
