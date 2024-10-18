import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Injectable } from "@nestjs/common";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(private configuration: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configuration.get<string>("JWT_SECRET"),
      name: "JWT"
    });
  }
}