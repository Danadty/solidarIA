import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile } from '@nestjs/common';
import { CampaignImageService } from './campaign-image.service';
import { CreateCampaignImageDto } from './dto/create-campaign-image.dto';
import { UpdateCampaignImageDto } from './dto/update-campaign-image.dto';

@Controller('campaign-image')
export class CampaignImageController {
  constructor(private readonly campaignImageService: CampaignImageService) {}

  @Post(':campaignId')
  public async upload(
    @Param('campaignId') campaignId: string,
    @UploadedFile() file: Express.Multer.File,
    @Body("description") description: string,
  ){
    return this.campaignImageService.create(campaignId, file, description);
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
