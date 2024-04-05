import {
  Column,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Department {
  @PrimaryGeneratedColumn('uuid')
  @Field()
  id: string;

  @Column()
  @Field()
  name: string;

  @Column()
  @Field((type) => Int)
  floor: number;

  @Column({ nullable: true })
  @Field({ nullable: true })
  email?: string;

  @Column({ nullable: true, name: 'phone_number' })
  @Field({ nullable: true })
  phoneNumber?: string;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  @Field((type) => Date)
  updatedAt: Date;
}
