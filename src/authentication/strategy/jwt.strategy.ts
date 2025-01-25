import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";

import { SecureUser, type User } from "../../user/user.types";
import { DatabaseService } from "../../database/database.service";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, "JWT") {
  constructor(
    private configuration: ConfigService,
    private database: DatabaseService
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configuration.get<string>("JWT_SECRET"),
      name: "JWT"
    });
  }

  async validate(payload: { id: number; email: string }) {
    const user: User = await this.database.user.findUnique({
      where: {
        id: payload.id
      }
    });
    delete user.password;
    return user as SecureUser;
  }
}
