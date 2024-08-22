import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import * as argon from "argon2";

import { DatabaseService } from "../database/database.service";

import { AuthenticationUserDTO } from "../user/user.dto";
import { SecureUser } from "../user/user.types";

@Injectable()
export class AuthenticationService {
  constructor(private database: DatabaseService) {}

  async register(user: AuthenticationUserDTO): Promise<SecureUser> {
    try {
      // Hash the password:
      user.password = await argon.hash(user.password);
      // Save the user:
      const $user = await this.database.user.create({
        data: user
      });
      delete $user.password;
      return $user;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
          throw new ForbiddenException("An user with the provided email already exists.");
        }
      }
      throw error;
    }
  }

  async authenticate(user: AuthenticationUserDTO) {
    const $user = await this.database.user.findUnique({ where: { email: user.email } });
    if (!$user || !(await argon.verify($user.password, user.password))) {
      throw new ForbiddenException("Either the provided email or the provided password is incorrect.");
    }
    delete $user.password;
    return $user;
  }
}
