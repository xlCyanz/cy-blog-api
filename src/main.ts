import { NestFactory } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

import { ConfigService } from "@config/config.service";

import { AppModule } from "./app.module";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());

  const config = app.get(ConfigService);

  await app.listen(config.getPort());
};

bootstrap();
