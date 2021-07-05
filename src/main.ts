import './dotenv-config';
// import { cpus } from 'os';
// import cluster from 'cluster';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import compression from 'compression';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { UserInputError } from 'apollo-server';
import { json } from 'body-parser';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';


const PORT = parseInt(process.env.APP_PORT ?? '3000', 10);

// const numCPUs = cpus().length;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: process.env.NODE_ENV === 'production' ? false : ['error', 'debug', 'warn'],
    cors: true,
    bodyParser: true,
  });

  app.use(cookieParser());
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setGlobalPrefix('api/v1');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      disableErrorMessages: true,
      validateCustomDecorators: false,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => {
        const errData: Record<string, any> = {};
        errors.map((v) => {
          errData[v.property] = v.constraints;
        });
        throw new UserInputError('Validation failed', errData);
      },
    }),
  );
  app.use(json({ limit: '10mb' })); //The default limit defined by body-parser is 100kb
  app.use(helmet());
  app.use(compression());
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  

  const options = new DocumentBuilder()
    .setTitle('Travel-booking-backend')
    .setDescription('Travel-booking-backend API description')
    .setVersion('1.0')
    .addTag('template')
    .addBearerAuth({ type: 'apiKey', name: 'Authorization', in: 'header' })
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT);
  console.info(`Application is running on: ${await app.getUrl()}`);
}
bootstrap().finally(() => {
  //
});

process.on('beforeExit', (code) => {
  console.log('Process beforeExit event with code: ', code);
});

process.on('exit', (code) => {
  console.log('Process exit event with code: ', code);
});

// process.on('unhandledRejection', (reason, promise) => {
//     console.log('Unhandled Rejection at:', promise, 'reason:', reason);
// });

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);
//   console.info(`Application is running on: ${PORT}`);

//   // Fork workers.
//   for (let i = 0; i < numCPUs; i++) {
//     // cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   // bootstrap();

//   console.log(`Worker ${process.pid} started`);
// }
