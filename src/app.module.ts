import { PromModule } from '@digikare/nestjs-prom';
import { MailerModule } from '@nestjs-modules/mailer';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SES } from 'aws-sdk';
import nodemailer from 'nodemailer';
import path from 'path';
import { AppController } from './app.controller';
import { gqlOptions } from './graphql/gql-options';
import { AuthModule } from './modules/auth/auth.module';
import { MediaModule } from './modules/media/media.module';
import { UsersModule } from './modules/users/users.module';
import { typeORMConfig } from './typeorm.config';
import { CountriesModule } from './modules/countries/countries.module';
import { CitiesModule } from './modules/cities/cities.module';
// import { TouristsModule } from './tourists/tourists.module';
import { TouristAreasModule } from './modules/tourist-areas/tourist-areas.module';
import { HotelModule } from './modules/hotels/hotel.module';



@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: path.join(process.cwd(), 'webapp'),
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    MediaModule.forRoot({
      uploadDir: 'uploads',
      quality: 70,
    }),
    PromModule.forRoot({
      defaultLabels: {
        app: 'my_app',
      },
      // customUrl:'/'
    }),
    GraphQLModule.forRoot(gqlOptions),
    AuthModule.forRoot({
      secret: 'Gofl Salon secret',
    }),
    MailerModule.forRoot({
      transport: nodemailer.createTransport({
        SES: new SES({
          apiVersion: '2010-12-01',
        }),
      }),
      defaults: {
        from: '"Harry Duong" <noreply@golfsalon.com>',
      },
      template: {
        dir: __dirname + '/email-templates',
        // adapter: new HandlerBa(),
        options: {
          strict: true,
        },
      },
    }),
    UsersModule,
    CountriesModule,
    CitiesModule,
    TouristAreasModule,
    HotelModule,
  ],
  // providers: [JSONObjectScalar],
  controllers: [AppController],
})
export class AppModule {}
