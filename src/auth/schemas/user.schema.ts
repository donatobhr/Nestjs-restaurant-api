import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export enum UserRole {
    ADMIN = 'admin',
    USER = 'user'
}

@Schema({
    timestamps: true
})
export class User extends Document
{
    @Prop()
    name: string;

    @Prop({unique: [true, 'Email must be unique']})
    email: string;

    @Prop({select: false})
    password: string;

    @Prop({
        enum: UserRole,
        default: UserRole.USER
    })
    role: UserRole
}

export const UserSchema = SchemaFactory.createForClass(User);