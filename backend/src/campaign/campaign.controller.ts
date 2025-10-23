import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Role } from 'src/common/types/user.types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(createCampaignDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Get()
  findAll() {
    return this.campaignService.findAll();
  }

  // @ApiOperation({ summary: 'Upload first campaign portada with idCampaign' })
  // @Post(':id/upload-portada')
  // @UseInterceptors(FileInterceptor('file'))
  // @ApiConsumes('multipart/form-data')
  // async uploadPortada(
  //   @Param('id') id: string,
  //   @UploadedFile() file: Express.Multer.File,
  // ){
  //   return this.campaignService.uploadPortada(file, id);
  // }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @ApiOperation({ summary: 'Update or upload campaign portada with idCampaign' })
  @Post(':id/update-portada')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  async updatePortada(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.campaignService.uploadOrUpdatePortada(file, id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Post(':id/images')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        description: { type: 'string' },
      },
    },
  })
  public async uploadImage(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("description") description: string,
  ) {
    return this.campaignService.uploadImage(file, id, description);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Delete('image/:id')
  @ApiParam({ name: 'id', description: 'ID of image campaign', example: 'uuid-image' })
  async deleteCampaignImage(@Param('id') id: string) {
    return this.campaignService.deleteCampaignImage(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Get(':id/images')
  @ApiParam({ name: 'id', description: 'ID de la campaña', example: 'uuid-campaign' })
  async getCampaignImages(@Param('id') id: string) {
    return this.campaignService.getCampaignImages(id);
  }

  /*
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.campaignService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateCampaignDto: UpdateCampaignDto) {
      return this.campaignService.update(+id, updateCampaignDto);
    }*/

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }
}
