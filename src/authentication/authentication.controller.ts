import { Body, Controller, Post } from "@nestjs/common";

import { AuthenticationService } from "./authentication.service";

import { NewUserDTO } from "../user/user.dto";

@Controller("authentication")
export class AuthenticationController {
  constructor(private service: AuthenticationService) {}

  @Post("sign-up")
  async signUp(@Body() user: NewUserDTO) {
    return await this.service.register(user);
  }

  @Post("sign-in")
  async signIn() {
    return this.service.authenticate();
  }
}
