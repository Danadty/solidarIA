import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { UserCampaignService } from './user-campaign.service';
import { CreateUserCampaignDto } from './dto/create-user-campaign.dto';
import { UpdateUserCampaignDto } from './dto/update-user-campaign.dto';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AuthGuard } from 'src/common/guards/auth.guards';
import { RolesGuard } from 'src/common/guards/roles.guards';
import { Role } from 'src/common/types/user.types';
import { Public } from 'src/common/decorators/public.decorator';
@Controller('user-campaign')
export class UserCampaignController {
  constructor(private readonly userCampaignService: UserCampaignService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Post()
  create(@Body() createUserCampaignDto: CreateUserCampaignDto) {
    return this.userCampaignService.create(createUserCampaignDto);
  }


  @Public()
  @Get()
  findAll() {
    return this.userCampaignService.findAll();
  }

  @Public()
  @ApiOperation({ summary: 'Get all campaigns a user has joined' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({ status: 200, description: 'List of campaigns for a user' })
  @Get('user/:id')
  findAllByUser(@Param('id', new ParseUUIDPipe({ version: '4' })) userid: string) {
    return this.userCampaignService.findAllByUser(userid);
  }

  @Public()
  @Get('campaign/:id')
  @ApiOperation({ summary: 'Get all users associated with a campaign' })
  @ApiParam({
    name: 'id',
    description: 'UUID of the campaign',
    example: 'b8a9f8a2-3e8c-42af-b8c7-92c5a3eeb711',
  })
  @ApiResponse({ status: 200, description: 'List of users for a campaign' })
  @ApiResponse({ status: 404, description: 'Campaign not found' })
  async findByCampaign(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
  ) {
    return this.userCampaignService.findByCampaign(id);
  }

  // unsubscribe a user to a campaign
  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(Role.USER, Role.FOUNDATION)
  @Delete(':userId/:campaignId')
  async unsubscribe(
    @Param('userId') userId: string,
    @Param('campaignId') campaignId: string,
  ) {
    return this.userCampaignService.unsubscribe(userId, campaignId);
  }

  /*
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.userCampaignService.findOne(+id);
    }
  
    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserCampaignDto: UpdateUserCampaignDto) {
      return this.userCampaignService.update(+id, updateUserCampaignDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.userCampaignService.remove(+id);
    }*/
}
