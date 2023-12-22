import { IsNotEmpty, Length, Max } from "class-validator";
import { Column } from "typeorm";

export class CreateCommentDto {
  @IsNotEmpty()
  @Column({ length: 1000, nullable: false })
  content: string
}
