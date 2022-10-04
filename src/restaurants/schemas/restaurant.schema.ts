import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import APIFeautures from "src/utils/apiFeature.utils";

export class Location {

    @Prop({ type: String, enum: ['Point'] })
    type: string;

    @Prop({ index: '2dsphere' })
    coordinates: Number[]

    @Prop()
    formattedAddress: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    zipcode: string;

    @Prop()
    countryCode: string;
}

export enum Category {
    FAST_FOOD = 'Fast Food',
    CAFE = 'Cafe',
    FINE_DINNING = 'Fine Dinning'
}

@Schema()
export class Restaurant {

    @Prop({ required: true })
    name: string;

    @Prop({ required: true })
    description: string;

    @Prop({ required: true })
    email: string;

    @Prop({ required: true })
    phone: number;

    @Prop({ required: true })
    address: string;

    @Prop({ enum: Category, required: true })
    category: Category;

    @Prop()
    images?: object[];

    @Prop({ type: Object, ref: 'Location' })
    location?: Location;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.pre('save', async function () {
    if (this.isNew)
        this.location = await APIFeautures.getRestaurantGeoCode(this.address);
});

RestaurantSchema.post('findOneAndDelete', async function(restaurant: Restaurant) {
    if(restaurant && restaurant.images.length)
    {
        await APIFeautures.deleteImages(restaurant.images);
    }
});