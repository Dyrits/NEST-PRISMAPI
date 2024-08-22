import { Body, Controller, Post } from "@nestjs/common";

import { AuthenticationService } from "./authentication.service";

import { AuthenticationUserDTO } from "../user/user.dto";

@Controller("authentication")
export class AuthenticationController {
  constructor(private service: AuthenticationService) {}

  @Post("sign-up")
  async signUp(@Body() user: AuthenticationUserDTO) {
    return await this.service.register(user);
  }

  @Post("sign-in")
  async signIn(@Body() user: AuthenticationUserDTO) {
    return this.service.authenticate(user);
  }
}
