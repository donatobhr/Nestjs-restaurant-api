# Nestjs Restaurant API

This project is part of the course [NestJs - Build Modern APIs in NestJs with Unit Testing](https://www.udemy.com/course/nestjs-build-modern-apis-in-nestjs-with-mongodb-postgres/) , is not 1:1 with the course, I added some guards and middlewares to preserve Single Rensibility Principle in controllers and to practice more with Nestjs features.

I add a postman collection [file](https://github.com/donatobhr/Nestjs-restaurant-api/blob/master/Restaurant%20API.postman_collection.json) in case you would like to use it.

To run this project you need to create an .env.development file and add the values to the key above.

```text
DB_URI={{mongoDbUri}}
GEOCODER_PROVIDER=
GEOCODER_API_KEY=
AWS_S3_BUCKET_NAME=
ACCESS_KEY_AWS=
SECRET_KET_AWS=
JWT_SECRET=
JWT_EXPIRES=1d
```

As GEOCODE provider, I used [mapquest](https://www.mapquest.com/) in my project, but you can use others.

The s3 bucket is just to save the images of the restaurants.
