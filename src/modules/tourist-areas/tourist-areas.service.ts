import { Injectable, NotFoundException } from "@nestjs/common";
import { getConnection, getManager } from "typeorm";
import { MediaService } from "../media/services/media.service";
import {
  TouristAreaRepository,
  TouristAreasRatesRepository,
} from "./touries-area.repository";
import { NewAreaInput, RateTouristAreaInput } from "./tourisr-area.input";
import { TouristArea, TouristAreasRates } from "./tourist-area.entity";

@Injectable()
export class TouristAreasService {
  constructor(
    private readonly areaRepository: TouristAreaRepository,
    private readonly touristAreasRatesRepository: TouristAreasRatesRepository,
    private readonly mediaService: MediaService
  ) {}

  createArea = async (input: NewAreaInput) => {
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const newCity = new TouristArea({
      areaName: input.areaName,
      cityId: input.cityId,
      price: input.price,
      description: input.description,
    });
    try {
      newCity.areaMedias = await this.mediaService.getMedias(input.imageId);
      const createNewCity = await queryRunner.manager.save(newCity);
      await queryRunner.commitTransaction();
      return createNewCity;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error || "save_unsuccessfully");
    } finally {
      await queryRunner.release();
    }
  };

  updateArea = async (input: NewAreaInput, id: string) => {
    const findCountry = this.areaRepository.findOne(id);
    if (!findCountry) throw new NotFoundException("Not found");
    const queryRunner = getConnection().createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const updateCountry = new TouristArea({
      areaName: input.areaName,
      cityId: input.cityId,
      price: input.price,
      description: input.description,
    });
    try {
      await this.areaRepository.delete(id);
      updateCountry.areaMedias = await this.mediaService.getMedias(
        input.imageId
      );
      const createNewProduct = await queryRunner.manager.save(updateCountry);
      await queryRunner.commitTransaction();
      return createNewProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new Error(error || "save_unsuccessfully");
    } finally {
      await queryRunner.release();
    }
  };

  delete = async (id: string) => {
    const findCountry = await this.areaRepository.findOne(id);
    if (!findCountry) throw new NotFoundException("Not found");
    await this.areaRepository.delete(id);
    return true;
  };

  getById = async (id: string) => {
    const aliasBuilder = "tourist_areas";
    const queryBuilder = this.areaRepository.createQueryBuilder(aliasBuilder);
    queryBuilder.leftJoinAndSelect("tourist_areas.areaMedias", "media");
    queryBuilder.leftJoinAndSelect("tourist_areas.cities", "cities");
    queryBuilder.leftJoinAndSelect("tourist_areas.rates", "rates");
    queryBuilder.leftJoinAndSelect("cities.countries", "countries");
    // queryBuilder.leftJoinAndSelect('countries.countries', 'country');
    queryBuilder.andWhere(`tourist_areas.id = '${id}'`);
    queryBuilder.orderBy(`${aliasBuilder}.createdAt`, "DESC");
    return queryBuilder.getOne();
  };

  searchAreas = async (
    areaName: string | undefined,
    page: number | undefined,
    limit: number | undefined
  ) => {
    limit = limit || 20;
    page = page || 1;
    const aliasBuilder = "tourist_areas";
    const queryBuilder = this.areaRepository.createQueryBuilder(aliasBuilder);
    if (areaName && areaName.length > 0) {
      queryBuilder.orWhere(`${aliasBuilder}.area_name ILIKE :NAME`, {
        NAME: `%${areaName}%`,
      });
    }
    queryBuilder.leftJoinAndSelect("tourist_areas.areaMedias", "media");
    queryBuilder.leftJoinAndSelect("tourist_areas.cities", "cities");
    queryBuilder.leftJoinAndSelect("cities.countries", "countries");
    queryBuilder.orderBy(`${aliasBuilder}.createdAt`, "DESC");
    return await this.areaRepository.customPaginate(queryBuilder, {
      limit,
      page,
    });
  };

  findByCityId = async (id: string) => {
    const find = await this.areaRepository.findOne({ cityId: id });
    if (find) return true;
    return false;
  };

  rateTouristArea = async (input: RateTouristAreaInput, userId: string) => {
    const findComment = await this.touristAreasRatesRepository.findOne({
      where: {
        touristAreasId: input.touristAreasId,
        userId,
      },
    });
    if (findComment) {
      await this.touristAreasRatesRepository.update(findComment.id, {
        star: input.star,
        comment: input.comment,
      });
      const getAvgStar = await getManager().query(
        `select AVG(star) from tourist_areas_rates where tourist_areas_id = '${input.touristAreasId}'`
      );
      await this.areaRepository.update(input.touristAreasId, {
        avgStar: getAvgStar[0].avg,
      });
      return findComment;
    }
    const newRate = new TouristAreasRates({
      touristAreasId: input.touristAreasId,
      star: input.star,
      userId: userId,
      comment: input.comment,
    });
    const getAvgStar = await getManager().query(
      `select AVG(star) from tourist_areas_rates where tourist_areas_id = '${input.touristAreasId}'`
    );
    await this.areaRepository.update(input.touristAreasId, {
      avgStar: getAvgStar[0].avg,
    });
    return await this.touristAreasRatesRepository.save(newRate);
  };
}
