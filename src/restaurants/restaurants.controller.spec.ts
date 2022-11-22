import { ForbiddenException } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRole } from "src/auth/schemas/user.schema";
import { RestaurantsController } from "./restaurants.controller";
import { RestaurantsService } from "./restaurants.service";

const mockRestaurant = {
    "_id": "633e5d14c87cdba7a2ed3ef6",
    "name": "Donato test permissions guard 2",
    "description": "This is just a description 3",
    "email": "ghulam@gamil.com",
    "phone": 8096693872,
    "address": "Churchill, Santo Domingo",
    "category": "Fine Dinning",
    "images": [],
    "user": "633e5cbfc87cdba7a2ed3ef1",
    "location": {
        "type": "Point",
        "coordinates": [
            -69.946108,
            18.480852
        ],
        "formattedAddress": "Avenida Winston Churchill, Santo Domingo, Distrito Nacional 10129, DO",
        "city": "Santo Domingo",
        "state": "Distrito Nacional",
        "zipcode": "10129",
        "countryCode": "DO"
    },
    "__v": 2,
    "menu": [
        "63410507ef8dabadec95a2ee",
        "6346400778a9c81362fdec19"
    ],
    "updatedAt": "2022-10-25T03:41:25.571Z"
};

const mockUser = {
    _id: "633e5d14c87cdba7a2ed3ef6",
    name: "donato",
    email: "donato@email.com",
    role: UserRole.USER,
    password: "12345678"
}

const mockRestaurantService = {
    findAll: jest.fn().mockResolvedValueOnce([mockRestaurant]),
    find: jest.fn().mockResolvedValue(mockRestaurant),
    create: jest.fn()
}


describe('RestaurantController', () => {

    let controller: RestaurantsController;
    let service: RestaurantsService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
            controllers: [RestaurantsController],
            providers: [
                {
                    provide: RestaurantsService,
                    useValue: mockRestaurantService
                }
            ]
        }).compile();

        controller = module.get<RestaurantsController>(RestaurantsController);
        service = module.get<RestaurantsService>(RestaurantsService);
    });

    it('should be define', () => {
        expect(controller).toBeDefined;
    });

    it('should retrieve all restaurants', async () => {
        const result = await controller.getAll({keyword: 'restaurant'});

        expect(service.findAll).toHaveBeenCalled();
        expect(result).toEqual([mockRestaurant]);
    });

    it('should retrieve a restaurant by ID', async () => {
        const result = await controller.getRestaurant(mockRestaurant._id);

        expect(service.find).toHaveBeenCalled();
        expect(result).toEqual(mockRestaurant);
    });

    it('should create a new restaurant', async () => {
        const newMockRestaurant = {...mockRestaurant};
        mockRestaurantService.create = jest.fn().mockResolvedValueOnce(mockRestaurant);

        const result = await controller.create(newMockRestaurant as any, mockUser as any);

        expect(service.create).toHaveBeenCalled();
        expect(result).toEqual(mockRestaurant);
    });
})