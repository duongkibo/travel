// import { Controller } from '@nestjs/common';
import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiGatewayManagementApi } from 'aws-sdk';
import { CurrentUserRest } from 'src/decorators/common.decorator';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';
import { User } from '../users/entities/users.entity';
import { CitiesService } from './cities.service';
import { NewCityInput, SearchCityInput } from './city.dto';
// import { CountriesService } from './countries.service';
// import { NewCountryInput, SearchCountryInput } from './dto/country_input';

@ApiTags('cities')
@Controller('cities')
export class CitiesController {
    constructor(private readonly countryService: CitiesService){}
      @Post()
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard)
          async createCity(@Body() createUser: NewCityInput,  @CurrentUserRest() user: User) {
              if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
            return this.countryService.createCountry(createUser);
          }

      @Get()
      // @ApiBearerAuth()
      // @UseGuards(JwtAuthGuard)
         async listOrSearchCountry(@Param() input: SearchCityInput,  @CurrentUserRest() user: User) {
                return await this.countryService.searchCity(input.keyword, input.page, input.limit);
              }
     

     @ApiBearerAuth()
         @UseGuards(JwtAuthGuard)
         @Put('/updateCity/:id')
         async updateUser(@Param('id') id: string,  @CurrentUserRest() user: User, @Body() updateCountry: NewCityInput) {
           if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
           return this.countryService.updateCountry(updateCountry, id);
         }

      @Get('/:id')
             async getCountryById(@Param('id') id: string) {
               return this.countryService.getById(id);
             }

      @ApiBearerAuth()
          @UseGuards(JwtAuthGuard)
          @Delete('/deleteCountry/:id')
          async deleteUser(@Param('id') id: string,  @CurrentUserRest() user: User) {
            if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
            return this.countryService.delete(id);
            }
}


