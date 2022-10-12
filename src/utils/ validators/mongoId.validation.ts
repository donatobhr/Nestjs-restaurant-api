import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId } from 'mongoose';

@Injectable()
export class MongoIdValidator implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        if(!isValidObjectId(value))
            throw new BadRequestException('Wrong db Id format')
        
        return value;
    }
}