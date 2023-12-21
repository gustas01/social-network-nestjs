import { IsEmail, IsStrongPassword } from "class-validator";

export class LoginDto {

  @IsEmail()
  email: string;

  @IsStrongPassword({
    minLength: 5,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
