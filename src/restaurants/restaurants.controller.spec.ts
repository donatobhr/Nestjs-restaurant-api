import { PassportModule } from "@nestjs/passport";
import { Test, TestingModule } from "@nestjs/testing";
import { UserRole } from "../auth/schemas/user.schema";
import { Readable } from "stream";
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
    findAll: jest.fn().mockResolvedValue([mockRestaurant]),
    find: jest.fn().mockResolvedValue(mockRestaurant),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue(mockRestaurant),
    uploadImages: jest.fn()
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
        const restaurant = {...mockRestaurant};

        const result = await controller.getAll({keyword: 'restaurant'});

        expect(service.findAll).toHaveBeenCalled();
        expect(result).toEqual([restaurant]);
    });

    it('should retrieve a restaurant by ID', async () => {
        const restaurant = {...mockRestaurant};

        const result = await controller.getRestaurant(restaurant._id);

        expect(service.find).toHaveBeenCalled();
        expect(result).toEqual(restaurant);
    });

    it('should create a new restaurant', async () => {
        const restaurant = {...mockRestaurant};
        const newMockRestaurant = {...mockRestaurant};
        mockRestaurantService.create.mockResolvedValueOnce(restaurant);

        const result = await controller.create(newMockRestaurant as any, mockUser as any);

        expect(service.create).toHaveBeenCalled();
        expect(result).toEqual(restaurant);
    });

    it('should update a restaurant', async () => {
        const restaurant = {...mockRestaurant, name: 'updated restaurant'};
        const updateRestaurant = { name: 'updated restaurant' };

        mockRestaurantService.update.mockResolvedValueOnce(restaurant);

        const result = await controller.update(restaurant._id, updateRestaurant as any);

        expect(service.update).toHaveBeenCalled();
        expect(result).toEqual(restaurant);
    });

    it('should delete a restaurant', async () => {
        const restaurant = {...mockRestaurant};

        const result = await controller.delete(restaurant._id);

        expect(service.delete).toHaveBeenCalled();
        expect(result).toEqual(restaurant);
    });

    it('should upload images', async () => {
        const files = [
            {
                filename: 'image1.jpeg',
                fieldname: 'files',
                originalname: 'image1.jpeg',
                encoding: '7bit',
                mimetype: 'image/jpeg',
                buffer: "<Buffer ff 88 12 3d />" as unknown as Buffer,
                size: 19288,
                destination: "",
                path: '/',
                stream: '' as unknown as Readable
            }
        ]
        const mockImages = [
            {
              "ETag": "bc91752bfd2495f3f12da05ddd2f20d7",
              "Location": "https://donatoaws-nestjs-restaurant-api.s3.amazonaws.com/restaurants/Barbieri_-_ViaSophia25668_1667774324250.jpg",
              "Key": "restaurants/Barbieri_-_ViaSophia25668_1667774324250.jpg",
              "key": "restaurants/Barbieri_-_ViaSophia25668_1667774324250.jpg",
              "Bucket": "donatoaws-nestjs-restaurant-api"
            }
          ];
        const restaurant = {...mockRestaurant, images: mockImages};
        mockRestaurantService.uploadImages.mockResolvedValueOnce(restaurant);

        const result = await controller.uploadFiles(restaurant._id, files);

        expect(service.uploadImages).toHaveBeenCalled();
        expect(result).toEqual(restaurant);
        expect(result.images.length).toBe(1);
    });
})