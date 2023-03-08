import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Media } from './media.entity';

export interface ResponseFormat<T> {
  status: string
  message: string;
  data: T;
}

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async create(media: Media): Promise<ResponseFormat<Media>> {
    const createdMedia = await this.mediaRepository.save(media);

    return {
      status: 'success',
      message: 'Media was created successfully',
      data: createdMedia
    }
  }

  async findAll(page: number, perPage: number): Promise<ResponseFormat<Media[]>> {
    const skip = (page -1) * perPage;

    const media = await this.mediaRepository.find({
        where: { deletedAt: null},
        skip,
        take: perPage,
    });

    return {
      status: 'success',
      message: 'Media fetched successfully',
      data: media
    }
  }

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOneBy({id});

    if (!media) {
      throw new Error(`Media with the given id ${id} not found`);
    }

    return media
  }

  async search(query: string): Promise<ResponseFormat<Media[]>> {
    const media = await this.mediaRepository.find({
      where: [
        {name: Like(`%${query}%`)},
        {description: Like(`%${query}%`)},
        {deletedAt: null}
      ],
     
    });

    return {
      status: 'success',
      message: 'Search Successful',
      data: media
    }
  }

  async updateStatus(id: string, status: string): Promise<ResponseFormat<Media>> {
    const result = await this.mediaRepository.update(id, {status});
    if (result.affected === 0) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }
    const updatedMedia = await this.mediaRepository.findOneBy({id});
    if (!updatedMedia) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }

    return { status: 'success', message: 'Media updated successfully', data: updatedMedia};
  }

  async softDelete(id: string): Promise<ResponseFormat<Media>> {
    const media = await this.mediaRepository.findOneBy({id});
    if (!media) {
      throw new NotFoundException(`Media with ID ${id} not found.`);
    }

    await this.mediaRepository.softDelete(id);

    return {
      status: 'success',
      message: 'Delete successful',
      data: media
    }
  }
}

