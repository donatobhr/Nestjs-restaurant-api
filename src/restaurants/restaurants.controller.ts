import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFiles, UseInterceptors } from '@nestjs/common';
import RestaurantDto from './dto/restaurant.dto';
import { RestaurantsService } from './restaurants.service';
import { Restaurant } from './schemas/restaurant.schema';
import { Query as ExpressQuery } from 'express-serve-static-core';
import mongoose from 'mongoose';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('restaurants')
export class RestaurantsController {

    constructor(private resturantsService: RestaurantsService) {}

    @Get()
    async getAll(@Query() query: ExpressQuery): Promise<Restaurant[]>
    {
        return this.resturantsService.findAll(query)
    }

    @Get(':id')
    async getRestaurant(@Param('id') id: string): Promise<Restaurant> {
        //convert this to a Pipe
        const validId = mongoose.isValidObjectId(id);
        if(!validId)
            throw new BadRequestException('Wrong db Id format')

        return this.resturantsService.find(id);
    }

    @Post()
    async create(@Body() restaurant: RestaurantDto): Promise<Restaurant> {
        return this.resturantsService.create(restaurant);
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() restaurant: Partial<RestaurantDto>): Promise<Restaurant>{
        const validId = mongoose.isValidObjectId(id);
        if(!validId)
            throw new BadRequestException('Wrong db Id format')

        return this.resturantsService.update(id, restaurant);
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<Restaurant> {
        return await this.resturantsService.delete(id);
    }

    @Put('upload/:id')
    @UseInterceptors(FilesInterceptor('files'))
    async uploadFiles(
        @Param('id') id: string, 
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<Restaurant> {
        return await this.resturantsService.uploadImages(id, files);
    }
}
