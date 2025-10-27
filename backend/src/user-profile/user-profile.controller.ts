import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { UserProfileService } from './user-profile.service';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { Role } from 'src/common/types/user.types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService,
    private cloudinaryService: CloudinaryService,
  ) { }


  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Post()
  create(@Body() createUserProfileDto: CreateUserProfileDto) {
    return this.userProfileService.create(createUserProfileDto);
  }

  @Public()
  @Get()
  findAll() {
    return this.userProfileService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @ApiOperation({ summary: 'Upload user profile photo with iduser' })
  @Post(':id/upload-photo')
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
  public async uploadProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.userProfileService.uploadPhoto(file, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @ApiOperation({ summary: 'Update user profile photo with iduser' })
  @Patch(':id/update-photo')
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
  async updateProfilePhoto(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const uploaded = await this.cloudinaryService.uploadImage(file);

    return this.userProfileService.updatePhoto(id, {
      url: uploaded.url,
      publicId: uploaded.public_id,
    });
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @ApiOperation({ summary: 'Delete user profile photo with iduser' })
  @Delete(':userid/photo')
  public async deletePhoto(
    @Param('userid') userid: string,
  ) {
    return this.userProfileService.deletePhoto(userid);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Get(':id')
  public async findOne(@Param('id') id: string) {
    return this.userProfileService.findOne(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Patch(':id')
  public async update(@Param('id') id: string, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    return this.userProfileService.update(id, updateUserProfileDto);
  }
  /*
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.userProfileService.remove(+id);
    }*/
}
