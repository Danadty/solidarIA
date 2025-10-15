import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FoundationService } from './foundation.service';
import { CreateFoundationDto } from './dto/create-foundation.dto';
import { UpdateFoundationDto } from './dto/update-foundation.dto';

@Controller('foundation')
export class FoundationController {
  constructor(private readonly foundationService: FoundationService) {}

  @Post()
  create(@Body() createFoundationDto: CreateFoundationDto) {
    return this.foundationService.create(createFoundationDto);
  }

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
}
