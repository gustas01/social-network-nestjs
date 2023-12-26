import { Post } from "src/post/entities/post.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string
  
  @Column()
  likes: number = 0
  
  @Column({length: 1000})
  content: string
  
  @ManyToOne(() => User, (user) => user.comments, {cascade: true})
  author: User
  
  @ManyToOne(() => Post, (post) => post.comments, {cascade: true})
  post: Post
}
