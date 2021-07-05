import { Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUserRest } from 'src/decorators/common.decorator';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';
import { User } from '../users/entities/users.entity';
import { NewAreaInput, SearchAreaInput } from './tourisr-area.input';
import { TouristAreasService } from './tourist-areas.service';
@ApiTags('tourist-area')
@Controller('tourist-areas')
export class TouristAreasController {
    constructor(private readonly areaService: TouristAreasService){}
    @Post()
    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
        async createArea(@Body() createUser: NewAreaInput,  @CurrentUserRest() user: User) {
            if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
          return this.areaService.createArea(createUser);
        }

        @ApiBearerAuth()
        @UseGuards(JwtAuthGuard)
        @Put('/updateArea/:id')
        async updateArea(@Param('id') id: string,  @CurrentUserRest() user: User, @Body() updateCountry: NewAreaInput) {
          if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
          return this.areaService.updateArea(updateCountry, id);
        }

        @ApiBearerAuth()
        @UseGuards(JwtAuthGuard)
        @Delete('/deleteArea/:id')
        async deleteArea(@Param('id') id: string,  @CurrentUserRest() user: User) {
          if (!user.roles?.includes('SUPERADMIN') &&!user.roles?.includes('ADMIN'))  throw new ForbiddenException('Not have permission');
          return this.areaService.delete(id);
          }

          @Get()
      // @ApiBearerAuth()
      // @UseGuards(JwtAuthGuard)
         async listOrSearchArea(@Param() input: SearchAreaInput,  @CurrentUserRest() user: User) {
                return await this.areaService.searchAreas(input.keyword, input.page, input.limit);
              }

              @Get('/:id')
              async getAreaById(@Param('id') id: string) {
                return this.areaService.getById(id);
              }
}
