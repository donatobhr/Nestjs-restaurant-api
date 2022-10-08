import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { User } from 'src/auth/schemas/user.schema';
import { Restaurant } from 'src/restaurants/schemas/restaurant.schema';
import { MealDto } from './dto/meal.dto';
import { Meal } from './schema/meal.schema';

@Injectable()
export class MealService {

    constructor(
        @InjectModel(Meal.name) private mealModel: mongoose.Model<Meal>,
        @InjectModel(Restaurant.name) private restaurantModel: mongoose.Model<Restaurant>    
    ){}


    async create(meal: Partial<Meal>, user: User): Promise<Meal> {
        const restaurant = await this.restaurantModel.findById(meal.restaurant);
        if(!restaurant)
            throw new NotFoundException('Restaurant not found');

        if(restaurant.user.toString() !== user._id.toString())
            throw new ForbiddenException('Cant add meal to this resturant');

        const newMeal = new this.mealModel(meal);
        newMeal.user = user;
        
        const createdMeal = await newMeal.save();
        restaurant.menu.push(createdMeal);
        restaurant.save();
        return createdMeal;
    }
}
