import { Injectable } from "@nestjs/common";
import { MongooseModuleOptions } from "@nestjs/mongoose";

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    this.envConfig = process.env;
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public getMongoConfig(): MongooseModuleOptions {
    return {
      uri: this.get("MONGO_URI"),
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };
  }

  public getPort(): number {
    return Number(this.get("PORT"));
  }
}
