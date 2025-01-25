import { Injectable } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(configuration: ConfigService) {
    super({
      datasources: {
        db: {
          url: configuration.get<string>("DATABASE_URL"),
        }
      }
    });
  }
}
