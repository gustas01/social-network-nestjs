import { IsEmail, IsNotEmpty, IsStrongPassword, MinLength } from "class-validator";

export class CreateUserDto {
  @MinLength(3)
  @IsNotEmpty()
  name: string;

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
