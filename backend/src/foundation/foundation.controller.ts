import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { UpdateFoundationDto } from './dto/update-foundation.dto';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Role } from 'src/common/types/user.types';

@Controller('foundation')
export class FoundationController {
  constructor(private readonly foundationService: FoundationService,
    private cloudinaryService: CloudinaryService,
  ) { }

  @Post()
  create(@Body() createFoundationDto: CreateFoundationDto) {
    return this.foundationService.create(createFoundationDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @Get()
  findAll() {
    return this.foundationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.foundationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFoundationDto: UpdateFoundationDto) {
    return this.foundationService.update(id, updateFoundationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.foundationService.remove(id);
  }

  @Post(':foundationId/upload-logo')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
    required: true,
  })
  public async uploadLogo(
    @Param('foundationId') foundationId: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploaded = await this.cloudinaryService.uploadImage(file);
    return this.foundationService.updateLogo(foundationId, {
      url: uploaded.url,
      publicId: uploaded.public_id,
    });
  }

}
