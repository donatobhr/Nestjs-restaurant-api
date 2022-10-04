import { IsArray, IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString } from "class-validator";
import { Category } from "../schemas/restaurant.schema";

export default class RestaurantDto
{
    @IsNotEmpty()
    @IsString()
    readonly name: string;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsEmail({}, {message: 'Please enter a correct email'})
    readonly email: string;

    @IsNotEmpty()
    @IsPhoneNumber('DO')
    readonly phone: number;

    @IsNotEmpty()
    @IsString()
    readonly address: string;

    @IsNotEmpty()
    @IsEnum(Category, {})
    readonly category: Category;

    @IsArray()
    @IsOptional()
    readonly images?: object[];
}