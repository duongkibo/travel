import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserRest } from 'src/decorators/common.decorator';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';
import { User } from '../users/entities/users.entity';
import { BookAreaInput, LocationInput, NewAreaInput, SearchAreaInput } from './tourisr-area.input';
import { TouristAreasService } from './tourist-areas.service';
import { UserBookTourService } from './user-book-tour.service';
const admin = require('firebase-admin');

@ApiTags('user-book-tour')
@Controller('user-book-tour')
export class UserBookTourController {
  constructor(private readonly userBookTourService: UserBookTourService) { }
  @Post()
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async bookArea(@Body() createUser: BookAreaInput, @CurrentUserRest() user: User) {
    let message = {
        notification: 'Đây là đài tiếng nói Việt Nam',
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
    return this.userBookTourService.createBook(createUser, user.id);
  }

  @Post('/send-location')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async sendLocation(@Body() input: LocationInput, @CurrentUserRest() user: User) {
    return this.userBookTourService.createUserLocation(input.location, user.id);
  }

  @Get(
    '/book_tour'
  )
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async listbookHotel(@Param() input: SearchAreaInput, @CurrentUserRest() user: User) {
    return this.userBookTourService.listBook(input, user.id);
  }

  //     @ApiBearerAuth()
  //     @UseGuards(JwtAuthGuard)
  //     @Put('/updateArea/:id')
  //     async updateArea(@Param('id') id: string,  @CurrentUserRest() user: User, @Body() updateCountry: NewAreaInput) {
  //       if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
  //       return this.areaService.updateArea(updateCountry, id);
  //     }

  //     @ApiBearerAuth()
  //     @UseGuards(JwtAuthGuard)
  //     @Delete('/deleteArea/:id')
  //     async deleteArea(@Param('id') id: string,  @CurrentUserRest() user: User) {
  //       if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
  //       return this.areaService.delete(id);
  //       }

  //       @Get()
  //   // @ApiBearerAuth()
  //   // @UseGuards(JwtAuthGuard)
  //      async listOrSearchArea(@Param() input: SearchAreaInput,  @CurrentUserRest() user: User) {
  //             return await this.areaService.searchAreas(input.keyword, input.page, input.limit);
  //           }

  //           @Get('/:id')
  //           async getAreaById(@Param('id') id: string) {
  //             return this.areaService.getById(id);
  //           }
}
