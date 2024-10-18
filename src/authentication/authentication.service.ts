import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from "argon2";

import { DatabaseService } from "../database/database.service";

import { AuthenticationUserDTO } from "../user/user.dto";
import { SecureUser } from "../user/user.types";

export interface JWTToken {
  token: string;
  expiration: Date;
  user: { id: number };
}

@Injectable()
export class AuthenticationService {
  constructor(
    private database: DatabaseService,
    private jwt: JwtService,
    private configuration: ConfigService
  ) {}

  async register(user: AuthenticationUserDTO): Promise<JWTToken> {
    try {
      // Hash the password:
      user.password = await argon.hash(user.password);
      // Save the user:
      const $user = await this.database.user.create({
        data: user
      });
      delete $user.password;
      return {
        token: await this.sign($user),
        expiration: new Date(Date.now() + 15 * 60 * 1000),
        user: { id: $user.id }
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("An user with the provided email already exists.");
        }
      }
      throw error;
    }
  }

  async authenticate(user: AuthenticationUserDTO): Promise<JWTToken> {
    const $user = await this.database.user.findUnique({ where: { email: user.email } });
    if (!$user || !(await argon.verify($user.password, user.password))) {
      throw new ForbiddenException("Either the provided email or the provided password is incorrect.");
    }
    delete $user.password;
    return {
      token: await this.sign($user),
      expiration: new Date(Date.now() + 15 * 60 * 1000),
      user: { id: $user.id }
    };
  }

  async sign(user: SecureUser): Promise<string> {
    const secret = this.configuration.get<string>("JWT_SECRET");
    return this.jwt.signAsync(user, { expiresIn: "15m", secret });
  }
}
