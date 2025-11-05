import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, UseGuards } from '@nestjs/common';
import { CampaignImageService } from './campaign-image.service';
import { CreateCampaignImageDto } from './dto/create-campaign-image.dto';
import { UpdateCampaignImageDto } from './dto/update-campaign-image.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { Role } from 'src/common/types/user.types';
import { Roles } from 'src/common/decorators/roles.decorator';
import { Public } from 'src/common/decorators/public.decorator';

@Controller('campaign-image')
export class CampaignImageController {
  constructor(private readonly campaignImageService: CampaignImageService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER)
  @ApiOperation({ summary: 'Upload campaign image with campaignId' })
  @Post(':campaignId')
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
    required: true,
  })
  public async uploadCampaignImage(
    @Param('campaignId') campaignId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("description") description: string,
  ) {
    return this.campaignImageService.uploadCampaignImage(campaignId, file, description);
  }


  @Public()
  @ApiOperation({ summary: 'Get all campaign images by campaignId' })
  @Get(':campaignId')
  public async getImagesByCampaign(@Param('campaignId') campaignId: string) {
    return this.campaignImageService.getImagesByCampaign(campaignId);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @ApiOperation({ summary: 'Delete campaign image with imageId' })
  @Delete(':imageId')
  deleteImage(@Param('imageId') imageId: string) {
    return this.campaignImageService.deleteImage(imageId);
  }

  /*
  @Post()
  create(@Body() createCampaignImageDto: CreateCampaignImageDto) {
    return this.campaignImageService.create(createCampaignImageDto);
  }*/

  /*
  @Get()
  findAll() {
    return this.campaignImageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.campaignImageService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCampaignImageDto: UpdateCampaignImageDto) {
    return this.campaignImageService.update(+id, updateCampaignImageDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.campaignImageService.remove(+id);
  }
    */
}
