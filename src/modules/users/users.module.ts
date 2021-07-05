import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './services/users.service';
import { UserRepository } from './repositories/users.repository';
import { User } from './entities/users.entity';
// import { UsersResolver } from './resolvers/users.resolver';
import { UserDataLoader } from './dataloaders/users.dataloader';
import { UsersController } from './controllers/users.controller';
import { UserBookTourService } from '../tourist-areas/user-book-tour.service';
import { TouristAreasModule } from '../tourist-areas/tourist-areas.module';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserRepository]), forwardRef(() => TouristAreasModule)],
  providers: [UserDataLoader, UsersService],
  exports: [UsersService, UserDataLoader],
  controllers: [UsersController],
})
export class UsersModule {}
