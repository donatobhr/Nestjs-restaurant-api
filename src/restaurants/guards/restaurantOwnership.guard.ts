import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs";
import { RestaurantsService } from "../restaurants.service";

@Injectable()
export class RestaurantOwnershipGuard implements CanActivate
{
    constructor(private restaurantService: RestaurantsService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const {user, params} = context.switchToHttp().getRequest();
        const id = params.id;
        const restaurant = await this.restaurantService.find(id);
        if(restaurant.user.toString() !== user._id.toString())
            throw new UnauthorizedException();
        return true;
    }
}