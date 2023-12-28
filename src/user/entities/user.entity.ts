import { Comment } from "src/comment/entities/comment.entity";
import { Post } from "src/post/entities/post.entity";
import { Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 60, nullable: false })
  name: string;

  @Column({ unique: true, nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({nullable: true})
  avatarUrl: string

  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[]
  
  @OneToMany(() => Post, (post) => post.author)
  posts: Post[]

  @ManyToMany(() => User)
  @JoinTable()
  friends: User[]

  @ManyToMany(() => User)
  @JoinTable()
  receivedFriendRequests: User[]
  
  @ManyToMany(() => User)
  @JoinTable()
  addressedFriendRequests: User[]
}
