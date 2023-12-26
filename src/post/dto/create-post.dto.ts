import { IsNotEmpty, MaxLength, MinLength } from "class-validator"

export class CreatePostDto {
  @IsNotEmpty()
  @MaxLength(30)
  title: string
  
  @IsNotEmpty()
  @MaxLength(1000)
  content: string
}
