import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser, CurrentUserRest } from 'src/decorators/common.decorator';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';
import { CheckLocationInput, NewUserInput, SearchUserInput, UpdateUserInput } from '../dto/new_user.input';
import { User } from '../entities/users.entity';
import { UsersService } from '../services/users.service';

@ApiTags('Users')

@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService){}
    @Post()
    async signUp(@Body() createUser: NewUserInput) {
      return this.userService.signup(createUser, undefined);
    }

    @Post('/admin_create_user')
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    async createByAdmin(@Body() createUser: NewUserInput, @CurrentUserRest() user: User) {
      console.log(user)
      if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
      return this.userService.signup(createUser, user.id);
    }

    @Get('/:id')
    async getUserById(@Param('id') id: string) {
      return this.userService.findOne(id);
    }

    @Get('/')
    async getAndSearchUser(@Param() searchUser: SearchUserInput) {
      return await this.userService.searchUser(searchUser);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Put('/updateUser/:id')
    async updateUser(@Param('id') id: string,  @CurrentUserRest() user: User, @Body() createUser: UpdateUserInput) {
      if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
      return this.userService.update(id, createUser);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Delete('/deleteUser/:id')
    async deleteUser(@Param('id') id: string,  @CurrentUserRest() user: User) {
      if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
      return this.userService.delete(id);
    }

    @Get('checkLocation/:id')
    async checkLocation(@Param() input: CheckLocationInput) {
      return this.userService.checkLocation(input.id, input.limit, input.page);
    }

} 
