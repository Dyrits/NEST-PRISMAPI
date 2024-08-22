import { IsEmail, IsNotEmpty, Length } from "class-validator";

import { NewUser } from "./user.types";

class AuthenticationUserDTO implements NewUser {
  @IsEmail()
  @IsNotEmpty()
  email: string;
  @IsNotEmpty()
  @Length(8)
  password: string;

  firstName: string | null;
  lastName: string | null;
}

export { AuthenticationUserDTO };
