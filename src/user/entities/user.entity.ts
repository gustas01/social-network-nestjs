import { Comment } from "src/comment/entities/comment.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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
  
  // @Column()
  // @JoinColumn()
  // post: Post[]
}
