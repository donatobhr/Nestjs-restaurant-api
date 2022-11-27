import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserDto } from './dto/user.dto';
import { User } from './schemas/user.schema';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import APIFeautures from '../utils/apiFeature.utils';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<User>,
        private jwtService: JwtService
    ){}

    async signUp(user: UserDto): Promise<{token: string}>
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
            
            const token = await APIFeautures.assignJwtToken(newUser._id, this.jwtService);
            return {token};
        }catch(error){
            if(error.code === 11000)
                throw new ConflictException('Email not available');
        }
    }

    async login(user: Partial<UserDto>): Promise<{token: string}>
    {
        const {email, password} = user;
        const validUser = await this.userModel.findOne({email}).select('+password');

        if(!validUser)
            throw new UnauthorizedException('Invalid email address or password')
            
        const isPasswordMatched = await bcrypt.compare(password, validUser.password);
            
        if(!isPasswordMatched)
            throw new UnauthorizedException('Invalid email address or password')
        
        const token = await APIFeautures.assignJwtToken(validUser._id, this.jwtService);
        return {token};
    }
}
