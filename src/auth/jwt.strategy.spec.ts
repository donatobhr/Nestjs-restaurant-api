import { UnauthorizedException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test, TestingModule } from "@nestjs/testing";
import { Model } from "mongoose";
import { JwtStrategy } from "./jwt.strategy";
import { User, UserRole } from "./schemas/user.schema";

const mockUser = {
    _id: "633e5d14c87cdba7a2ed3ef6",
    name:"donato",
    email:"donato@email.com",
    role: UserRole.USER,
};

describe('JwtStrategy', () => {
    let jwtStrategy: JwtStrategy;
    let model: Model<User>;

    beforeEach(async () => {
        process.env.JWT_SECRET = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZX';

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                JwtStrategy,
                {
                    provide: getModelToken(User.name),
                    useValue: {
                        findById: jest.fn()
                    }
                }
            ]
        }).compile();

        jwtStrategy = module.get<JwtStrategy>(JwtStrategy);
        model = module.get<Model<User>>(getModelToken(User.name));
    });


    afterEach(() => {
        delete process.env.JWT_SECRET;
    });

    it('should be defined', () => {
        expect(jwtStrategy).toBeDefined();
    });


    it('should validate and return user', async () => {
        const user = {...mockUser};
        jest
            .spyOn(model, 'findById')
            .mockResolvedValueOnce(user);

        const result = await jwtStrategy.validate({id: user._id});
        
        expect(result).toEqual(user);
    });

    it('should throw Unauthorize Exception', async () => {
        const user = {...mockUser};

        jest
            .spyOn(model, 'findById')
            .mockResolvedValueOnce(null);

        await expect(jwtStrategy.validate({id: user._id})).rejects.toThrow(UnauthorizedException);
    })
});