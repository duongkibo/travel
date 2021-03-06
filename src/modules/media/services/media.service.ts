import { Injectable } from '@nestjs/common';
import { MediaRepository } from '../repositories/media.repository';
import { MediaEntity } from '../entities/media.entity';
import { DeepPartial, In } from 'typeorm';

@Injectable()
export class MediaService {
  constructor(private readonly mediaRepository: MediaRepository) {}

  addMedia = async (data: DeepPartial<MediaEntity>, parentId?: number | string) => {
    const media = this.mediaRepository.create(data);
    if (parentId) {
      const parent = await this.mediaRepository.findOne(parentId);
      media.parent = parent;
    }
    return await this.mediaRepository.save(media);
  };

  removeMedia = async (id: number | string) => {
    const media = await this.mediaRepository.findOneOrFail(id, {
      where: {
        isDeleted: false,
      },
    });
    media.isDeleted = true;
    return this.mediaRepository.save(media);
  };

  updateMedia = async (data: { id: string; name: string }) => {
    await this.mediaRepository.update(data.id, { name: data.name });
    return this.mediaRepository.findOneOrFail(data.id);
  };

  async pagination({ page, limit }: { parentId?: string; page?: number; limit?: number }) {
    return this.mediaRepository.paginate({ page, limit });
  }

  getMedias = async (id: (string | undefined)[]) => {
    try {
      return await this.mediaRepository.find({ where: { id: In(id) } });
    } catch (error) {
      console.log(error);
    }
  }
}
