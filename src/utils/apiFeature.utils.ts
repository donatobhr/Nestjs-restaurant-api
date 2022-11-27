import { JwtService } from '@nestjs/jwt';
import { S3 } from 'aws-sdk';
import * as nodeGeoCode from 'node-geocoder';
import RestaurantS3Bucket from '../helpers/restaurantS3Bucket.helper';
import { Location } from '../restaurants/schemas/restaurant.schema';

export default class APIFeautures {

    constructor(private s3Bucket: RestaurantS3Bucket){}

    static async getRestaurantGeoCode(address: string)
    {
        try {
            const options: nodeGeoCode.Options = {
                provider: process.env.GEOCODER_PROVIDER as nodeGeoCode.Providers,
                apiKey: process.env.GEOCODER_API_KEY,
                httpAdapter: 'https',
                formatter: null
            }

            const geoCoder = nodeGeoCode(options);
            const coordinates = await geoCoder.geocode(address);
            const location : Location = {
                type: 'Point',
                coordinates: [coordinates[0].longitude, coordinates[0].latitude],
                formattedAddress: coordinates[0].formattedAddress,
                city: coordinates[0].city,
                state: coordinates[0].stateCode,
                zipcode: coordinates[0].zipcode,
                countryCode: coordinates[0].countryCode
            }
            return location;
        } catch (err)
        {
            console.error(err.message);
        }
    }

    static async uploadImages(files: Array<Express.Multer.File>): Promise<S3.ManagedUpload.SendData[]> 
    {
        return new Promise((resolve, reject) => {
            let images: S3.ManagedUpload.SendData[] = [];
            files.forEach(async (file) => {
                const uploadResponse = await RestaurantS3Bucket.getInstance().uploadImage(file);
                images.push(uploadResponse);
                if(images.length === files.length) {
                    resolve(images);
                }
            });
        });
    }

    static async deleteImages(images: Array<Object>)
    {
        return await RestaurantS3Bucket.getInstance().deleteImages(images);    
    }

    static async assignJwtToken(userId: string, jwtService: JwtService): Promise<string>
    {
        const payload = { id: userId }
        const token = await jwtService.sign(payload);
        return token;
    }
} 