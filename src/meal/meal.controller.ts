import { BadRequestException, Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import mongoose from 'mongoose';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { MealDto } from './dto/meal.dto';
import { MealService } from './meal.service';
import { Meal } from './schema/meal.schema';

@Controller('meals')
export class MealController {

    constructor(private mealService: MealService){}

    @Get()
    getMeals(): Promise<Meal[]>
    {
        return this.mealService.findAll();
    }

    @Get(':id')
    getMeal(@Param('id') id: string): Promise<Meal>
    {
        //TODO convert to a decorator :)
        const validId = mongoose.isValidObjectId(id);
        if (!validId)
            throw new BadRequestException('Wrong db Id format');

        return this.mealService.findById(id);
    }

    @Get('restaurant/:id')
    getMealsByRestaurant(@Param('id') id: string): Promise<Meal[]>
    {
        //TODO convert to a decorator :)
        const validId = mongoose.isValidObjectId(id);
        if (!validId)
            throw new BadRequestException('Wrong db Id format');

        return this.mealService.findByRestaurant(id);
    }

    @Post()
    @UseGuards(AuthGuard())
    createMeal(
        @Body() meal: MealDto,
        @CurrentUser() user: User
    ): Promise<Meal>{
        return this.mealService.create(meal, user);
    }

    @Put(':id')
    @UseGuards(AuthGuard())
    async updateMeal(
        @Param('id') id: string,
        @Body() newMeal: Partial<MealDto>,
        @CurrentUser() user: User
    ): Promise<Meal>
    {
        const validId = mongoose.isValidObjectId(id);
        if (!validId)
            throw new BadRequestException('Wrong db Id format');

        const meal = await this.mealService.findById(id);
        
        if(!meal)
            throw new NotFoundException('Meal not found');

        if(meal.user.toString() !== user._id.toString())
            throw new ForbiddenException('Cant update meal');

        return this.mealService.updateById(id, newMeal);
    }


    @Delete(':id')
    @UseGuards(AuthGuard())
    async deleteMeal(
        @Param('id') id: string,
        @CurrentUser() user: User
    ): Promise<Meal>
    {
        const meal = await this.mealService.findById(id);
        if(meal.user.toString() !== user._id.toString())
            throw new ForbiddenException('Cant Delete meal');

        //add middleware to delete from restaurant menu.
        return this.mealService.deleteById(id);
    }
}
