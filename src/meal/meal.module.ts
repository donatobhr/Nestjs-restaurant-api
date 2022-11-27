import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { RestaurantsModule } from '../restaurants/restaurants.module';
import { MealController } from './meal.controller';
import { MealService } from './meal.service';
import { Meal, MealSchema } from './schema/meal.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {name: Meal.name, schema: MealSchema}
    ]),
    RestaurantsModule
  ],
  controllers: [MealController],
  providers: [MealService]
})
export class MealModule {}
