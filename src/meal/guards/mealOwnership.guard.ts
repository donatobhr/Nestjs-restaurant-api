import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { MealService } from "../meal.service";

@Injectable()
export class MealOwneshipGuard implements CanActivate
{
    constructor(private mealService: MealService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {user, params} = context.switchToHttp().getRequest();
        const id = params.id;
        const meal = await this.mealService.findById(id);
        if(meal.user.toString() !== user._id.toString())
            throw new UnauthorizedException();
        return true;
    }
}