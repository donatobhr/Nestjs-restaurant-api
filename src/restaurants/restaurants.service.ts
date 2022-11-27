import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Query } from 'express-serve-static-core';
import { Model } from 'mongoose';
import { User } from '../auth/schemas/user.schema';
import APIFeautures from '../utils/apiFeature.utils';
import { Restaurant } from './schemas/restaurant.schema';

@Injectable()
export class RestaurantsService {

   constructor(
        @InjectModel(Restaurant.name)
        private restaurantModel: Model<Restaurant>
    ) {}

    async findAll(query: Query): Promise<Restaurant[]> {
        const resPerPage = 2;
        const currentPage = Number(query.page) || 1;
        const skip = resPerPage * (currentPage - 1);

        const keyword = query.keyword ? {
            name: {
                $regex: query.keyword,
                $options: 'i'
            }
        }: {};
        return await this.restaurantModel
            .find({...keyword})
            .limit(resPerPage)
            .skip(skip);
    }
    
    async find(id: string): Promise<Restaurant> {
        const restaurant = await this.restaurantModel.findById(id);
        if(!restaurant)
            throw new NotFoundException('Restaurant not found');

        return restaurant;
    }

    async create(restaurant: Partial<Restaurant>, user: User): Promise<Restaurant> {
        restaurant.user = user._id;
        return await this.restaurantModel.create(restaurant);
    }

    async update(id: string, restaurant: Partial<Restaurant>): Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndUpdate(id, restaurant, {
            new: true,
            runValidators: true,
            returnDocument: 'after'
        });
    }

    async delete(id: string): Promise<Restaurant> {
        return await this.restaurantModel.findByIdAndDelete(id, {
            returnOriginal: true
        });
    }

    async uploadImages(id: string, files: Array<Express.Multer.File>): Promise<Restaurant> {
        const images = await APIFeautures.uploadImages(files);
        const restaurant = await this.restaurantModel.findByIdAndUpdate(
            id,
            {
                images: images as Object[]
            },
            {
                new: true,
                runValidators: true,
                returnDocument: 'after'
            }
        )
        return restaurant;
    }
}
