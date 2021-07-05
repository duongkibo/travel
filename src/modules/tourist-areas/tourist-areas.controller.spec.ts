import { Test, TestingModule } from '@nestjs/testing';
import { TouristAreasController } from './tourist-areas.controller';

describe('TouristAreas Controller', () => {
  let controller: TouristAreasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TouristAreasController],
    }).compile();

    controller = module.get<TouristAreasController>(TouristAreasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
