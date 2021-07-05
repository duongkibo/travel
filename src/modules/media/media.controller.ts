import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, UploadedFiles } from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MediaService } from './services/media.service';
import { JwtAuthGuard } from 'src/guards/rest-auth.guard';
import { CurrentUserRest } from 'src/decorators/common.decorator';
import { MulterFile } from './media.interface';
import { CommandBus } from '@nestjs/cqrs';
import { ImageResizeCommand } from './commands/image-resize.command';
import { uploadImage } from '../../helpers/s3';
import * as path from 'path';

const acceptFiles = [
  '.png',
  '.jpg',
  '.gif',
  '.jpeg',
  '.svg',
  '.mp4',
  '.doc',
  '.docx',
  '.xls',
  '.xlsx',
  '.pdf',
  '.ppt',
  '.pptx',
];

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService, private commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('upload')
  @UseInterceptors(
    FilesInterceptor('files', 12, {
      fileFilter: (_req, files, callback) => {
        const ext = path.extname(files.originalname.toLowerCase());
        if (!acceptFiles.includes(ext)) {
          return callback(new Error('File not accept: ' + ext), false);
        }
        callback(null, true);
      },
    }),
  )
  async uploadFile(@UploadedFiles() files: MulterFile[], @CurrentUserRest('id') id: string) {
    const idMedia = await Promise.all(
      files.map(async (file) => {
        const ext = path.extname(file.originalname.toLowerCase());
        const fileName = new Date().getTime() + ext;
        const response = await uploadImage(file);
          const newMedia = await this.mediaService.addMedia(
            {
              name: file.originalname,
              mimeType: file.mimetype,
              filePath: response.url,
              fileSize: file.size,
              ownerId: id,
            },
          );
          const addMedia = await this.mediaService.addMedia(newMedia);
          return await addMedia.id;
        
      }),
    );
    return await this.mediaService.getMedias(idMedia);
  }
}
