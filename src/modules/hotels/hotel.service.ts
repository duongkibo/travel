import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { getConnection, getManager } from 'typeorm';
import { MediaService } from '../media/services/media.service';
import { HotelRateRepository, HotelRepository, UserBookHotelRepository } from './hotel.repository';
// import { NewAreaInput } from './hotel.input';
import { Hotels, HotelsRates, UserBookHotel } from './hotel.entity';
import { NewHotelInput, RateHotelInput, SearchHotelInput, UserBookHotelInput } from './hotel.input';
import { User } from '../users/entities/users.entity';

@Injectable()
export class HotelService {
    constructor(private readonly areaRepository: HotelRepository, private readonly mediaService: MediaService,
      private readonly rateHotelRepository: HotelRateRepository,
      private readonly userBookHotelRepository: UserBookHotelRepository){}

    createArea = async (input: NewHotelInput) =>  {
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        const newCity = new Hotels({
          hotelName: input.hotelName,
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
    
      updateArea = async (input: NewHotelInput, id: string) =>  {
        const findCountry = await this.areaRepository.findOne(id)
        if (!findCountry) throw new NotFoundException('Not found'); ;
        const queryRunner = getConnection().createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        
            findCountry.hotelName= input.hotelName,
            // findCountry.cityId= input.cityId,
            findCountry.price= input.price,
            findCountry.description= input.description
        try {
          findCountry.areaMedias = await this.mediaService.getMedias(input.imageId);
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

      delete = async (id: string) =>  {
        const findCountry = await this.areaRepository.findOne(id);
        if (!findCountry)    throw new NotFoundException('Not found'); 
        const findRate = await this.rateHotelRepository.findOne({ hotelId: id})
        const findBook = await this.userBookHotelRepository.findOne({hotelId: id})
        if (findRate || findBook) throw new BadRequestException('CANNOT_DELETE')
        await this.areaRepository.delete(id);
        return true;
      }

      getById = async (id: string) => {
        const aliasBuilder = 'hotels';
        const queryBuilder = this.areaRepository.createQueryBuilder(aliasBuilder);
        queryBuilder.leftJoinAndSelect('hotels.areaMedias', 'media');
        queryBuilder.leftJoinAndSelect('hotels.rates', 'rates');
        queryBuilder.leftJoinAndSelect('rates.users', 'users');
        queryBuilder.leftJoinAndSelect('hotels.cities', 'cities');
        queryBuilder.leftJoinAndSelect('cities.countries', 'countries');
        // queryBuilder.leftJoinAndSelect('countries.countries', 'country');
        queryBuilder.andWhere(`hotels.id = '${id}'`);
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return queryBuilder.getOne();
      }

      searchAreas = async (areaName: string | undefined, page: number | undefined, limit: number | undefined) => {
        limit = limit || 20;
        page = page || 1;
        const aliasBuilder = 'hotels';
        const queryBuilder = this.areaRepository.createQueryBuilder(aliasBuilder);
        if (areaName && areaName.length > 0) {
          queryBuilder.orWhere(`${aliasBuilder}.hotelName ILIKE :NAME`, { NAME: `%${areaName}%` });
        }
        queryBuilder.leftJoinAndSelect('hotels.areaMedias', 'media');
        queryBuilder.leftJoinAndSelect('hotels.rates', 'rates');
        queryBuilder.leftJoinAndSelect('hotels.cities', 'cities');
        queryBuilder.leftJoinAndSelect('cities.countries', 'countries');
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return await this.areaRepository.customPaginate(queryBuilder, { limit, page });
      };

      rateHotel = async (input: RateHotelInput, userId: string) => {
        const findComment = await this.rateHotelRepository.findOne({where : {
          hotelId: input.hotelId, userId
        }})
        if (findComment) {
          await this.rateHotelRepository.update(findComment.id, {
            star: input.star,
            comment: input.comment
          })
          const getAvgStar = await getManager().query(`select AVG(star) from hotels_rates where hotel_id = '${input.hotelId}'`)
          await this.areaRepository.update(input.hotelId, { avgStar : getAvgStar[0].avg})
          return findComment;
        }
        console.log(input.hotelId)
        const newRate = new HotelsRates({
          hotelId: input.hotelId,
          star: input.star,
          userId: userId,
          comment: input.comment
      });
        const getAvgStar = await getManager().query(`select AVG(star) from hotels_rates where hotel_id = '${input.hotelId}'`)
        await this.areaRepository.update(input.hotelId, { avgStar : getAvgStar[0].avg})
        return await this.rateHotelRepository.save(newRate);
      }

      deleteRate  = async (id: string, user: User) => {
        const findComment = await this.rateHotelRepository.findOne(id);
        if (!findComment) throw new NotFoundException('NOT_FOUND');
        if ((!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN')) || user.id != findComment.userId)  throw new ForbiddenException('Not have permission');
        return await this.rateHotelRepository.delete(findComment.id);
      }

      searchHotelRates = async (areaName: string | undefined, page: number | undefined, limit: number | undefined) => {
        console.log('abc')
        limit = limit || 20;
        page = page || 1;
        const aliasBuilder = 'hotels_rates';
        const queryBuilder = this.rateHotelRepository.createQueryBuilder('hotels_rates');
        // if (areaName && areaName.length > 0) {
        //   queryBuilder.orWhere(`${aliasBuilder}.comment ILIKE :NAME`, { NAME: `%${areaName}%` });
        // }
        // queryBuilder.leftJoinAndSelect('hotels_rates.areaMedias', 'media');
        queryBuilder.leftJoinAndSelect('hotels_rates.hotels', 'hotels');
        queryBuilder.leftJoinAndSelect('hotels_rates.users', 'users');
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return await this.rateHotelRepository.customPaginate(queryBuilder, { limit, page });
      };

      async createBook(input: UserBookHotelInput, userId) {
        const findArea = await this.areaRepository.findOne({ id : input.hotelId});
        console.log(findArea)
        if (!findArea) throw new NotFoundException('AREA_NOT_FOUND')
        const startTime = new Date(input.startTime);
        const endTime = new Date(input.endTime);
        console.log(startTime)
        console.log(endTime)
        if (endTime < startTime) throw new BadRequestException('END_TIME_MUST_BE_GREATER_THAN_START_TIME')
        const newBook = new UserBookHotel({
            startTime: startTime,
            endTime: endTime,
            numberPerson: input.numberPerson,
            totalPrice:   findArea.price ? findArea?.price * input.numberPerson : undefined,
            hotelId:  input.hotelId,
            userId: userId,
            roomType: input.roomType
        })
        return await this.userBookHotelRepository.save(newBook)
    }

    findByCityId = async (id: string) => {
      const find =  await this.areaRepository.findOne({ cityId: id});
      if (find) return true;
      return false;
    }

    async listBook(input: SearchHotelInput, userId) {
      const limit = input.limit || 20;
      const page = input.page || 1;
        const aliasBuilder = 'user_book_hotel';
        const queryBuilder = this.userBookHotelRepository.createQueryBuilder(aliasBuilder);
        queryBuilder.leftJoinAndSelect('user_book_hotel.users', 'users');
        queryBuilder.leftJoinAndSelect('user_book_hotel.hotels', 'hotels');
        queryBuilder.leftJoinAndSelect('hotels.cities', 'cities');
        queryBuilder.leftJoinAndSelect('cities.countries', 'countries');
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return await this.userBookHotelRepository.customPaginate(queryBuilder, { limit, page });
  }
}
