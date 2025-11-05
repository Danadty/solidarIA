import { Controller, Post, UploadedFile, UseInterceptors } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import { ApiBody, ApiConsumes } from "@nestjs/swagger";
import { FileInterceptor } from "@nestjs/platform-express";

@Controller('cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            },
        },
    })
    public async upload(@UploadedFile() file: Express.Multer.File) {
        return this.cloudinaryService.uploadImage(file);
    }
}
