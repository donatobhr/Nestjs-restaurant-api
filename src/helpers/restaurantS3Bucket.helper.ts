import { S3 } from "aws-sdk";
import { DeleteObjectsRequest, ObjectIdentifier, PutObjectRequest } from "aws-sdk/clients/s3";

export default class RestaurantS3Bucket
{
    private accessKey = process.env.ACCESS_KEY_AWS;
    private secretAccessKey = process.env.SECRET_KET_AWS;
    private static s3Instance: RestaurantS3Bucket;
    private bucket = process.env.AWS_S3_BUCKET_NAME;
    private folder = '/restaurants';
    private s3: S3

    static getInstance()
    {
        if(!RestaurantS3Bucket.s3Instance){
            RestaurantS3Bucket.s3Instance = new RestaurantS3Bucket();
        }
        return RestaurantS3Bucket.s3Instance;
    }
    
    private constructor()
    {
        this.s3 = new S3({
            accessKeyId: this.accessKey,
            secretAccessKey: this.secretAccessKey
        });
    }

    public uploadImage(file: Express.Multer.File): Promise<S3.ManagedUpload.SendData>
    {
        const splitName = file.originalname.split('.');
        const random = Date.now();
        const fileName = `${splitName[0]}_${random}.${splitName[1]}`;
        const params = this.getUploadObjectRequestOptions(fileName, file.buffer);
        return this.s3.upload(params).promise();
    }

    public deleteImages(images: any[]): Promise<Boolean|string>
    {
        let imagesKeys = images.map(image => ({Key: image.key}));
        const params = this.getDeleteObjectRequestOptions(imagesKeys);
        return new Promise((resolve, reject) => {
            this.s3.deleteObjects(params, (err, data) => {
                if(err) reject(err.message);
                resolve(true);
            });
        })
    }

    private getUploadObjectRequestOptions(filename: string, data: Buffer): PutObjectRequest
    {
        return {
            Bucket: `${this.bucket}${this.folder}`,
            Key: filename,
            Body: data
        }
    }

    private getDeleteObjectRequestOptions(keys: ObjectIdentifier[]): DeleteObjectsRequest
    {
        return {
            Bucket: this.bucket,
            Delete: {
                Objects: keys,
                Quiet: false
            }
        }
    }
}