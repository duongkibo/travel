import { Entity, Column, DeepPartial, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, HideField, ID } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { MediaEntity } from '../media/entities/media.entity';
import { Countries } from '../countries/countries.entity';
import { TouristArea } from '../tourist-areas/tourist-area.entity';

@ObjectType({
    implements: [Node],
  })
  @Entity({
    name: 'cities',
  })
  export class Cities implements Node {
    @Field(() => ID)
    @Column('bigint', {
            primary: true,
            unsigned: true,
          })
          id: string;
        
          @Column({ name: 'country_id' })
          countryId: string;
        
          @Column({ name: 'city_name', nullable: true })
          cityName?: string;
        
          @CreateDateColumn({ name: 'created_at' })
          createdAt: Date;
        
          @UpdateDateColumn({ name: 'updated_at', nullable: true })
          updatedAt: Date;
        
          @ManyToOne(() => Countries, (countries) => countries.id, { primary: true })
          @JoinColumn({ name: 'country_id' })
          countries: Promise<Countries>;
        
          @ManyToMany(() => MediaEntity, { cascade: true })
          @JoinTable()
          cityMedias?: MediaEntity[];

    // @OneToMany(() => TouristArea, (cities) => cities.areas, { primary: true })
    // cities?: TouristArea

    constructor(partial: DeepPartial<Cities>) {
      Object.assign(this, { id: snowflake.nextId(), ...partial });
    }
  }
  
  @ObjectType()
  export class CitiesConnection extends PaginationBase(Countries) {}
