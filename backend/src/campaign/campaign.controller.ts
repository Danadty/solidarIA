import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { CreateCampaignDto } from './dto/create-campaign.dto';
import { UpdateCampaignDto } from './dto/update-campaign.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiParam } from '@nestjs/swagger';

@Controller('campaign')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) { }

  @Post()
  create(@Body() createCampaignDto: CreateCampaignDto) {
    return this.campaignService.create(createCampaignDto);
  }

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
  @Delete('image/:id')
  @ApiParam({ name: 'id', description: 'ID of image campaign', example: 'uuid-image' })
  async deleteCampaignImage(@Param('id') id: string) {
    return this.campaignService.deleteCampaignImage(id);
  }

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

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignService.remove(id);
  }
}
