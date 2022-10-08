import { IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { User } from "src/auth/schemas/user.schema";
import { Restaurant } from "src/restaurants/schemas/restaurant.schema";
import { Category } from "../schema/meal.schema";

export class MealDto
{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    readonly price: number;

    @IsNotEmpty()
    @IsEnum(Category, {message: 'Please enter a valid category'})
    readonly category: Category;

    @IsNotEmpty()
    @IsString()
    readonly restaurant: string;

    readonly user?: User;
}