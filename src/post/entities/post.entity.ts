import { Comment } from "src/comment/entities/comment.entity";
import { User } from "src/user/entities/user.entity";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Post {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({nullable: false, length: 30})
  title: string
  
  @Column({nullable: false, length: 1000})
  content: string

  @ManyToOne(() => User, (user) => user.posts, {cascade: true})
  author: User

  @OneToMany(() => Comment, (comment) => comment.post)
  comments: Comment[]
}
