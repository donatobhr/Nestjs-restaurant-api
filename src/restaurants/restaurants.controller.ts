import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, Param, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import RestaurantDto from './dto/restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

@Controller('restaurants')
export class RestaurantsController {

    constructor(private resturantsService: RestaurantsService) { }

    @Get()
    async getAll(@Query() query: ExpressQuery): Promise<Restaurant[]> {
        return this.resturantsService.findAll(query)
    }

    @Get(':id')
    async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
        //convert this to a Decorator
        const validId = mongoose.isValidObjectId(id);
        if (!validId)
            throw new BadRequestException('Wrong db Id format')

        return this.resturantsService.find(id);
    }

    @Post()
    @UseGuards(AuthGuard(), RolesGuard)
    @Roles('admin', 'user')
    async create(@Body() restaurant: RestaurantDto, @CurrentUser() user: User): Promise<Restaurant> {
        return this.resturantsService.create(restaurant, user);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async update(
        @Param('id') id: string,
        @Body() restaurant: Partial<RestaurantDto>,
        @CurrentUser() user: User): Promise<Restaurant> {
        const validId = mongoose.isValidObjectId(id);
        if (!validId)
            throw new BadRequestException('Wrong db Id format')

        //TODO convert to a decorator :)
        const resta = await this.resturantsService.find(id);

        if (resta.user.toString() !== user._id.toString())
            throw new ForbiddenException('Unabled to access this resource');

        return this.resturantsService.update(id, restaurant);
    }

    @Delete(':id')
    @UseGuards(AuthGuard())
    async delete(
        @Param('id') id: string,
        @CurrentUser() user: User): Promise<Restaurant> {
        //convert to a decorator :)
        const resta = await this.resturantsService.find(id);

        if (resta.user.toString() !== user._id.toString())
            throw new ForbiddenException('Unabled to access this resource');

        return await this.resturantsService.delete(id);
    }

    @Put('upload/:id')
    @UseGuards(AuthGuard())
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<Restaurant> {
        return await this.resturantsService.uploadImages(id, files);
    }
}
