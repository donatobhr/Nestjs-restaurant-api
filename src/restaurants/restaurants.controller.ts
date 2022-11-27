import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import RestaurantDto from './dto/restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../auth/schemas/user.schema';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { MongoIdValidator } from '../utils/ validators/mongoId.validation';
import { RestaurantOwnershipGuard } from './guards/restaurantOwnership.guard';

@Controller('restaurants')
export class RestaurantsController {

    constructor(private resturantsService: RestaurantsService) { }

    @Get()
    async getAll(@Query() query: ExpressQuery): Promise<Restaurant[]> {
        return this.resturantsService.findAll(query)
    }

    @Get(':id')
    async getRestaurant(@Param('id', MongoIdValidator) id: string): Promise<Restaurant> {
        return this.resturantsService.find(id);
    }

    @Post()
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles('admin', 'user')
    async create(@Body() restaurant: RestaurantDto, @CurrentUser() user: User): Promise<Restaurant> {
        return this.resturantsService.create(restaurant, user);
    }

    @Put(':id')
    @UseGuards(AuthGuard(), RestaurantOwnershipGuard)
    async update(
        @Param('id', MongoIdValidator) id: string,
        @Body() restaurant: Partial<RestaurantDto>): Promise<Restaurant> {
        return this.resturantsService.update(id, restaurant);
    }

    @Delete(':id')
    @UseGuards(AuthGuard(), RestaurantOwnershipGuard)
    async delete(
        @Param('id') id: string): Promise<Restaurant> {
    
        return await this.resturantsService.delete(id);
    }

    @Put('upload/:id')
    @UseGuards(AuthGuard(), RestaurantOwnershipGuard)
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<Restaurant> {
        return await this.resturantsService.uploadImages(id, files);
    }
}
