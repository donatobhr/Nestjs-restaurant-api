import { Body, Controller, Delete, ForbiddenException, Get, NotFoundException, Param, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { MongoIdValidator } from 'src/utils/ validators/mongoId.validation';
import { MealDto } from './dto/meal.dto';
import { MealOwneshipGuard } from './guards/mealOwnership.guard';
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
    getMeal(@Param('id', MongoIdValidator) id: string): Promise<Meal>
    {
        return this.mealService.findById(id);
    }

    @Get('restaurant/:id')
    getMealsByRestaurant(@Param('id', MongoIdValidator) id: string): Promise<Meal[]>
    {
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
    @UseGuards(AuthGuard(), MealOwneshipGuard)
    async updateMeal(
        @Param('id', MongoIdValidator) id: string,
        @Body() newMeal: Partial<MealDto>,
    ): Promise<Meal>
    {
        return this.mealService.updateById(id, newMeal);
    }


    @Delete(':id')
    @UseGuards(AuthGuard(), MealOwneshipGuard)
    async deleteMeal(
        @Param('id') id: string
    ): Promise<Meal>
    {
        //add middleware to delete from restaurant menu.
        return this.mealService.deleteById(id);
    }
}
