import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserRest } from 'src/decorators/common.decorator';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';
import { User } from '../users/entities/users.entity';
import { NewHotelInput, RateHotelInput, SearchHotelInput, UserBookHotelInput } from './hotel.input';
// import { NewAreaInput, SearchAreaInput } from './hotel.input';
import { HotelService } from './hotel.service';
@ApiTags('hotels')
@Controller('hotels')
export class HotelsController {
    constructor(private readonly areaService: HotelService){}
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
        async createArea(@Body() createUser: NewHotelInput,  @CurrentUserRest() user: User) {
            if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
          return this.areaService.createArea(createUser);
        }

        @ApiBearerAuth()
        @UseGuards(JwtAuthGuard)
        @Put('/updateHotel/:id')
        async updateArea(@Param('id') id: string,  @CurrentUserRest() user: User, @Body() updateCountry: NewHotelInput) {
          if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
          return this.areaService.updateArea(updateCountry, id);
        }

        @ApiBearerAuth()
        @UseGuards(JwtAuthGuard)
        @Delete('/deleteHotel/:id')
        async deleteArea(@Param('id') id: string,  @CurrentUserRest() user: User) {
          if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
          return this.areaService.delete(id);
          }

          @Get()
      // @ApiBearerAuth()
      // @UseGuards(JwtAuthGuard)
         async listOrSearchArea(@Param() input: SearchHotelInput,  @CurrentUserRest() user: User) {
                return await this.areaService.searchAreas(input.keyword, input.page, input.limit);
              }

              @Get('/getDetail/:id')
              async getAreaById(@Param('id') id: string) {
                return this.areaService.getById(id);
              }

              @ApiBearerAuth()
              @UseGuards(JwtAuthGuard)
              @Post('/rateHotel')
              async rateHotel(@Body() input: RateHotelInput,  @CurrentUserRest() user: User) {
                return this.areaService.rateHotel(input, user.id);
                }

                @ApiBearerAuth()
                @UseGuards(JwtAuthGuard)
                @Delete('deleteRate/:id')
                async deleteRate(@Param('id') id: string,  @CurrentUserRest() user: User) {
                  return this.areaService.deleteRate(id, user);
                  }

                  @Get('/listHotelRate/')
                  @ApiBearerAuth()
                  @UseGuards(JwtAuthGuard)
                     async listRateHotel(@Param('input') input: SearchHotelInput,  @CurrentUserRest() user: User) {
                     if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
                     console.log('asdadasdsada');
                            return await this.areaService.searchHotelRates(input.keyword, input.page, input.limit);
                          }

                          @Post(
                            '/book_hotel'
                          )
                          @ApiBearerAuth()
                          @UseGuards(JwtAuthGuard)
                              async bookHotel(@Body() createUser: UserBookHotelInput,  @CurrentUserRest() user: User) {
                                return this.areaService.createBook(createUser, user.id);
                              }

                              @Get(
                                '/book_hotel'
                              )
                              @ApiBearerAuth()
                              @UseGuards(JwtAuthGuard)
                                  async listbookHotel(@Param() input: SearchHotelInput,  @CurrentUserRest() user: User) {
                                    return this.areaService.listBook(input, user.id);
                                  }
                      
}
