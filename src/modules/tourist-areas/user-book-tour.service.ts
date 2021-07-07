import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InputTypeFactory } from '@nestjs/graphql/dist/schema-builder/factories/input-type.factory';
import { getConnection } from 'typeorm';
import { MediaService } from '../media/services/media.service';
import { PaymentCardRepository, TouristAreaRepository, UserBookTourRepository, UserLocationRepository } from './touries-area.repository';
import { BookAreaInput, NewAreaInput, PaymentCardInput, SearchAreaInput } from './tourisr-area.input';
import { PaymentCard, TouristArea, UserBookTour, UserLocation } from './tourist-area.entity';
import axios from 'axios'
import { User } from '../users/entities/users.entity';
import { query } from 'express';
const admin = require('firebase-admin');

@Injectable()
export class UserBookTourService {
    constructor(private readonly areaRepository: TouristAreaRepository, private readonly userBookTourRepository: UserBookTourRepository,
        private readonly paymentCardRepository: PaymentCardRepository, private readonly locationRepository: UserLocationRepository) { }
    async createBook(input: BookAreaInput, userId) {
        const findArea = await this.areaRepository.findOne({ id: input.areaId });

        console.log(findArea)
        if (!findArea) throw new NotFoundException('AREA_NOT_FOUND')
        const startTime = new Date(input.startTime);
        const endTime = new Date(input.endTime);
        console.log(startTime)
        console.log(endTime)
        if (endTime < startTime) throw new BadRequestException('END_TIME_MUST_BE_GREATER_THAN_START_TIME')
        const newBook = new UserBookTour({
            startTime: startTime,
            endTime: endTime,
            numberPerson: input.numberPerson,
            totalPrice: findArea.price ? findArea?.price * input.numberPerson : undefined,
            areaId: input.areaId,
            userId: userId
        })
        return await this.userBookTourRepository.save(newBook)
    }

    async createPaymentCard(input: PaymentCardInput, userId) {
        const newBook = new PaymentCard({
            cardNumber: input.cardNumber,
            cardOwner: input.cardOwnner,
            cardType: input.cardType,
            userId
        })
        return await this.paymentCardRepository.save(newBook)
    }

    async createUserLocation(location: string, userId, token?: string) {
        console.log(location)
        const getResult = await axios.get(`https://www.metaweather.com/api/location/search/?lattlong=${location}`)
        console.log(getResult.status);
        if (getResult.status != 200) throw new NotFoundException('NOT_FOUND')
        const getWeather = await axios.get(`https://www.metaweather.com/api/location/${getResult.data[0].woeid}/`)
        if (getWeather.status != 200) throw new NotFoundException('NOT_FOUND')

        if (token) {
            let rawObjMsg = getWeather.data.consolidated_weather[0] || {};

            let rawMsg = `Khu vực: ${getWeather?.data?.title || ''}, Nhiệt độ: ${rawObjMsg?.the_temp || 0}, Tình trạng thời tiết ${rawObjMsg?.weather_state_name}`
            let rawStringObj = {};
            Object.keys(rawObjMsg).forEach(prop => {
                rawStringObj[prop] = rawObjMsg[prop].toString()
            })
            let message = {
                notification: {
                    title: 'Thông báo thời tiết khu vực',
                    body: rawMsg,
                },
                data: rawStringObj,
                token,
            };
            admin.messaging().send(message)
                .then((response) => {
                    // Response is a message ID string.
                    console.log('send message success')
                })
                .catch((error) => {
                    console.log(error)
                    console.log('send message failed')
                });
        }

        const newBook = new UserLocation({
            location: getResult.data[0],
            weather: getWeather.data,
            userId
        })
        return await this.locationRepository.save(newBook)
        // return await this.paymentCardRepository.save(newBook)
    }

    async getUserLocation(userId: string, limit: number, page: number) {
        limit = limit || 20;
        page = page || 1;
        const aliasBuilder = 'user_location';
        const queryBuilder = this.locationRepository.createQueryBuilder(aliasBuilder);
        queryBuilder.leftJoinAndSelect('user_location.users', 'users');
        queryBuilder.orWhere(`${aliasBuilder}.user_id = :id`, { id: `${userId}` });
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return await this.locationRepository.customPaginate(queryBuilder, { limit, page });
    };

    async listBook(input: SearchAreaInput, userId) {
        const limit = input.limit || 20;
        const page = input.page || 1;
        const aliasBuilder = 'user_book_tour';
        const queryBuilder = this.userBookTourRepository.createQueryBuilder(aliasBuilder);
        queryBuilder.leftJoinAndSelect('user_book_tour.users', 'users');
        queryBuilder.leftJoinAndSelect('user_book_tour.areas', 'areas');
        queryBuilder.leftJoinAndSelect('areas.cities', 'cities');
        queryBuilder.leftJoinAndSelect('cities.countries', 'countries');
        queryBuilder.orderBy(`${aliasBuilder}.createdAt`, 'DESC');
        return await this.userBookTourRepository.customPaginate(queryBuilder, { limit, page });
    }
}
