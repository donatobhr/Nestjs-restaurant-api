import { NotFoundException } from "@nestjs/common";
import { getModelToken } from "@nestjs/mongoose";
import { Test } from "@nestjs/testing";
import { Model } from "mongoose";
import { UserRole } from "src/auth/schemas/user.schema";
import APIFeautures from "src/utils/apiFeature.utils";
import { Readable } from "stream";
import { RestaurantsService } from "./restaurants.service";
import { Restaurant } from "./schemas/restaurant.schema";

const mockRestaurantModel = {
  find: jest.fn(),
  create: jest.fn(),
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
  findByIdAndDelete: jest.fn()
};

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
  name:"donato",
  email:"donato@email.com",
  role: UserRole.USER,
  password: "12345678"
}

describe('RestaurantService', () => {
  let service: RestaurantsService;
  let model: Model<Restaurant>

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RestaurantsService,
        {
          provide: getModelToken(Restaurant.name),
          useValue: mockRestaurantModel
        }
      ]
    }).compile();

    service = moduleRef.get<RestaurantsService>(RestaurantsService);
    model = moduleRef.get<Model<Restaurant>>(getModelToken(Restaurant.name));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('shoud get all restaurant', async () => {
    jest.spyOn(model, 'find').mockImplementationOnce(() => ({
      limit: () => ({
        skip: jest.fn().mockResolvedValue([mockRestaurant])
      })
    } as any));

    const restaurants = await service.findAll({keyword: 'restaurant'});
    expect(restaurants).toEqual([mockRestaurant]);
  });

  it('should create restaurant', async () => {
    const newMockRestaurant = {...mockRestaurant};
    newMockRestaurant.user = mockUser._id;

    jest
      .spyOn(model, 'create')
      .mockImplementationOnce(() => {
        return Promise.resolve(newMockRestaurant)
      });

    const result = await service.create(newMockRestaurant as any, mockUser as any);

    expect(result).toEqual(newMockRestaurant);
    expect(result.user).toEqual(mockUser._id);
  });

  it('should get restaurant by Id', async () => {
    jest.spyOn(model, 'findById').mockResolvedValueOnce(mockRestaurant as any);

    const result = await service.find(mockRestaurant._id);

    expect(result).toEqual(mockRestaurant);
  });

  it('shoud throw restaurant not found', async () => {
    jest
      .spyOn(model, 'findById')
      .mockResolvedValueOnce(null);

    let result;
    try {
      await service.find(mockRestaurant._id);
    } catch(error) {
      result = error;
    }

    expect(result).toBeInstanceOf(NotFoundException);
    expect(result.message).toEqual('Restaurant not found');
  });

  it('should update the restaurant', async () => {
    const restaurant = {...mockRestaurant, name: 'Updated name'};
    const updateRestaurant = { name: 'Updated name' };
    jest
      .spyOn(model, 'findByIdAndUpdate')
      .mockResolvedValueOnce(restaurant as any);

    const updatedRestaurant = await service.update(restaurant._id, updateRestaurant as any);

    expect(updatedRestaurant.name).toEqual(updateRestaurant.name);
  });

  it('should delete the restaurant', async () => {
    jest
      .spyOn(model, 'findByIdAndDelete')
      .mockResolvedValueOnce(mockRestaurant as any);

    const result = await service.delete(mockRestaurant._id);

    expect(result).toEqual(mockRestaurant);
  });

  it('should upload restaurant images on S3 Bucket', async () => {
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
    const updateRestaurant = { ...mockRestaurant, images: mockImages };

    jest
      .spyOn(APIFeautures, 'uploadImages')
      .mockResolvedValueOnce(mockImages);

    jest
      .spyOn(model, 'findByIdAndUpdate')
      .mockResolvedValueOnce(updateRestaurant as any);

    const result = await service.uploadImages(mockRestaurant._id, files);

    expect(result).toEqual(updateRestaurant);
  });
});