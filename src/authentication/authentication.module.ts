import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";

import { AuthenticationController } from "./authentication.controller";
import { AuthenticationService } from "./authentication.service";
import { DatabaseModule } from "../database/database.module";
import { JWTStrategy } from "./strategy/jwt.strategy";

@Module({
  imports: [DatabaseModule, JwtModule.register({})],
  controllers: [AuthenticationController],
  providers: [AuthenticationService, JWTStrategy]
})
export class AuthenticationModule {}
