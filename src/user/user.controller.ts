import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import * as argon from "argon2";

import { type SecureUser, type User } from "./user.types";
import { GetUser } from "../authentication/decorator";
import { JWTGuard } from "../authentication/guard";


@UseGuards(JWTGuard)
@Controller("users")
export class UserController {
  @Get("profile")
  getProfile(@GetUser() user: SecureUser) {
    return user;
  }

  @Patch("profile")
  async updateProfile(@GetUser() user: SecureUser, @Body() data: Partial<User>) {
    if (data.password) {
      data.password = await argon.hash(data.password);
    }
    const $user = { ...user, ...data };
    // @TODO: Update user in the database.
    delete $user.password;
    return $user;
  }
}
