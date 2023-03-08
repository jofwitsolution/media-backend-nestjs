import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MediaController } from './media/media.controller';
import { MediaService } from './media/media.service';
import { Media } from './media/media.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'database_password',
      database: 'media',
      entities: [Media],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Media]),
  ],
  controllers: [MediaController],
  providers: [MediaService],
})

export class AppModule {}
