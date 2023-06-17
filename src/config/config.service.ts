import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService {
  private readonly envConfig: Record<string, string>;

  constructor() {
    this.envConfig = process.env;
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public getPort(): number {
    return Number(this.get("PORT"));
  }
}
