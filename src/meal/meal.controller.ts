import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';
import { MealDto } from './dto/meal.dto';
import { MealService } from './meal.service';
import { Meal } from './schema/meal.schema';

@Controller('meal')
export class MealController {

    constructor(private mealService: MealService){}

    @Post()
    @UseGuards(AuthGuard())
    createMeal(
        @Body() meal: MealDto,
        @CurrentUser() user: User
    ): Promise<Meal>{
        return this.mealService.create(meal, user);
    }

}
