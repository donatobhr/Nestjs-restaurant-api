import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>
    ){}

    async signUp(user: UserDto): Promise<User>
    {
        const {name , email, password} = user;
        const hashedPassword = await bcrypt.hash(password, 10);

        try
        {
            const newUser = await this.userModel.create({
                name,
                email,
                password: hashedPassword
            })
    
            return newUser;
        }catch(error){
            if(error.code === 11000)
                throw new ConflictException('Email not available');
        }
    }
}
