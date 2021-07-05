import { Test, TestingModule } from '@nestjs/testing';
import { TouristAreasService } from './tourist-areas.service';

describe('TouristAreasService', () => {
  let service: TouristAreasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TouristAreasService],
    }).compile();

    service = module.get<TouristAreasService>(TouristAreasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
