import { Controller, Post } from "@nestjs/common";

import { AuthenticationService } from "./authentication.service";

@Controller("authentication")
export class AuthenticationController {
  constructor(private service: AuthenticationService) {
  }

  @Post("sign-up")
  async signUp() {
    return this.service.register();
  }

  @Post("sign-in")
  async signIn() {
    return this.service.authenticate();
  }
}
