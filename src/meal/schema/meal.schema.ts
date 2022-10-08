import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { Document } from "mongoose";
import { User } from "src/auth/schemas/user.schema";

export enum Category
{
    SOUPS = 'Soups',
    SALAD = 'Salads',
    SANDWICHES = 'Sandwiches',
    PASTA = 'Pasta'
}

@Schema({
    timestamps: true
})
export class Meal extends Document
{
    @Prop()
    name: string;

    @Prop()
    description: string;

    @Prop()
    price: number;

    @Prop({enum: Category})
    category: Category;

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant'})
    restaurant: string;

    @Prop({'type': mongoose.Schema.Types.ObjectId, ref: User.name})
    user: User;
}

export const MealSchema = SchemaFactory.createForClass(Meal);