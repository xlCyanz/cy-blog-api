import { ConfigService } from "./config.service";
import { Global, Module } from "@nestjs/common";
import { ConfigModule as NestConfigModule } from "@nestjs/config";

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(),
    },
  ],
  imports: [
    NestConfigModule.forRoot({
      envFilePath: [".env.development", ".env.production"],
    }),
  ],
  exports: [ConfigService],
})
export class ConfigModule {}