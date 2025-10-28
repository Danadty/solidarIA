import { Injectable } from '@nestjs/common';
import { cloudinary } from './cloudinary.provider';
import * as streamifier from 'streamifier';
interface CloudinaryUploadResult {
    secure_url: string;
    public_id: string;
}

@Injectable()
export class CloudinaryService {


    public async uploadImage(file: Express.Multer.File) {
        if (!file) {
            throw new Error('No file provided');
        }

        try {
            const result: CloudinaryUploadResult = await new Promise<any>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'APPong' },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result as CloudinaryUploadResult);
                    },
                );
                streamifier.createReadStream(file.buffer).pipe(uploadStream);
            });

            return { url: result.secure_url, public_id: result.public_id };
        } catch (error) {
            console.error('Error subiendo imagen:', error);
            throw error;
        }
    }

    public async deleteImage(publicId: string) {
        try {
            return await cloudinary.uploader.destroy(publicId);
        } catch (error) {
            console.error('Error borrando imagen en Cloudinary:', error);
            throw error;
        }
    }
}
