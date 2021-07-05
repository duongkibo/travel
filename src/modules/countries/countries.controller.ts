import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserRest } from 'src/decorators/common.decorator';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';
import { User } from '../users/entities/users.entity';
import { CountriesService } from './countries.service';
import { NewCountryInput, SearchCountryInput } from './dto/country_input';
@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
 constructor(private readonly countryService: CountriesService){}
      @Post()
      @ApiBearerAuth()
      @UseGuards(JwtAuthGuard)
          async createCountry(@Body() createUser: NewCountryInput,  @CurrentUserRest() user: User) {
              if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
            return this.countryService.createCountry(createUser);
          }

      @Get()
      // @ApiBearerAuth()
      // @UseGuards(JwtAuthGuard)
         async listOrSearchCountry(@Param() input: SearchCountryInput,  @CurrentUserRest() user: User) {
                return await this.countryService.searchCountry(input.keyword, input.page, input.limit);
              }
     

     @ApiBearerAuth()
         @UseGuards(JwtAuthGuard)
         @Put('/updateCountry/:id')
         async updateUser(@Param('id') id: string,  @CurrentUserRest() user: User, @Body() updateCountry: NewCountryInput) {
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


// @Controller('users')
// export class UsersController {
//     constructor(private readonly userService: UsersService){}
//     @Post()
//     async signUp(@Body() createUser: NewUserInput) {
//       return this.userService.signup(createUser);
//     }

//     @Get('/:id')
//     async getUserById(@Param('id') id: string) {
//       return this.userService.findOne(id);
//     }

//     @Get('/')
//     async getAndSearchUser(@Param() searchUser: SearchUserInput) {
//       return await this.userService.searchUser(searchUser);
//     }

//     @ApiBearerAuth()
//     @UseGuards(JwtAuthGuard)
//     @Put('/updateUser/:id')
//     async updateUser(@Param('id') id: string,  @CurrentUserRest() user: User, @Body() createUser: UpdateUserInput) {
//       if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
//       return this.userService.update(id, createUser);
//     }

//     @ApiBearerAuth()
//     @UseGuards(JwtAuthGuard)
//     @Delete('/deleteUser/:id')
//     async deleteUser(@Param('id') id: string,  @CurrentUserRest() user: User) {
//       if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
//       return this.userService.delete(id);
//     }

// } 
