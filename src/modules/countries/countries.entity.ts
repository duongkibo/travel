import { Entity, Column, DeepPartial, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, Int, HideField, ID } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { MediaEntity } from '../media/entities/media.entity';

@ObjectType({
    implements: [Node],
  })
  @Entity({
    name: 'countries',
  })
  export class Countries implements Node {
    @Field(() => ID)
    @Column('bigint', {
      primary: true,
      unsigned: true,
    })
    id: string;

    @Column({ length: 50, name: 'country_name' })
    countryName: string;

    @Column({  name: 'description', type: 'text', nullable: true })
    description?: string;
  
    @ManyToMany(() => MediaEntity, { cascade: true })
    @JoinTable()
    countryMedias?: MediaEntity[];
  
    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    constructor(partial: DeepPartial<Countries>) {
      Object.assign(this, { id: snowflake.nextId(), ...partial });
    }
  }
  
  @ObjectType()
  export class CountriesConnection extends PaginationBase(Countries) {}