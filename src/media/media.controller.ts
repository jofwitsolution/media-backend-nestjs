import { Controller, Get, Post, Patch, Delete, Query, Param, Body, UseInterceptors } from '@nestjs/common';
import { Media } from './media.entity';
import { MediaService, ResponseFormat } from './media.service';
import { ResponseInterceptor } from './media.iterceptor';

@Controller('media')
@UseInterceptors(ResponseInterceptor)
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post()
  async create(@Body() media: Media): Promise<ResponseFormat<Media>> {
    return this.mediaService.create(media);
  }

  @Get()
  async findAll(@Query('page') page: number, @Query('perPage') perPage: number): Promise<ResponseFormat<Media[]>> {
    return this.mediaService.findAll(page || 1, perPage || 12);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Media> {
    return this.mediaService.findOne(id);
  }

  @Get('search/query')
  async search(@Query('query') query: string): Promise<ResponseFormat<Media[]>> {
    return this.mediaService.search(query);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body('status') status: string): Promise<ResponseFormat<Media>> {
    return this.mediaService.updateStatus(id, status);
  }

  @Delete(':id')
  async softDelete(@Param('id') id: string): Promise<ResponseFormat<Media>> {
    return this.mediaService.softDelete(id);
  }
}
