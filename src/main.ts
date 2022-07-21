import { AppModule } from "./app.module";
import { NestFactory } from "@nestjs/core";
import { ConfigService } from "./config/config.service";

const bootstrap = async () => {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  await app.listen(config.getPort());
};

bootstrap();
