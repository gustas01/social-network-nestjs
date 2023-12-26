import { IsNotEmpty } from "class-validator";
import { Comment } from "src/comment/entities/comment.entity";
import { User } from "src/user/entities/user.entity";
import { ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @IsNotEmpty()
  title: string
  
  @IsNotEmpty()
  content: string

  @ManyToOne(() => User, (user) => user.posts, {cascade: true})
  author: User

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]
}
