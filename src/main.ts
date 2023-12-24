import { NestFactory, Reflector } from "@nestjs/core";
import { ClassSerializerInterceptor, ValidationPipe } from "@nestjs/common";

import { ConfigService } from "@config/config.service";

import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";

const bootstrap = async () => {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useGlobalPipes(new ValidationPipe({ forbidUnknownValues: false }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = app.get(ConfigService);

  await app.listen(config.getPort());
};

bootstrap();
