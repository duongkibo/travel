import { Entity, Column, DeepPartial, CreateDateColumn, UpdateDateColumn, ManyToMany, JoinTable, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, Int, HideField, ID } from '@nestjs/graphql';
import { Node, PaginationBase } from 'src/graphql/types/common.interface.entity';
import { snowflake } from 'src/helpers/common';
import { MediaEntity } from '../media/entities/media.entity';
import { Cities } from '../cities/citites.entity';
import { User } from '../users/entities/users.entity';

@ObjectType({
    implements: [Node],
  })
  @Entity({
    name: 'hotels',
  })
  export class Hotels implements Node {
    @Field(() => ID)
    @Column('bigint', {
      primary: true,
      unsigned: true,
    })
    id: string;
  
    @Column({ length: 50, name: 'hotel_name' })
    hotelName: string;

    @Column('bigint', { name: 'city_id' })
    cityId: string;

    @Column({  name: 'price', type: 'float' })
    price?: number;

    @Column({  name: 'description', type: 'text', nullable: true })
    description?: string;


    @Column({  name: 'avg_star', type: 'float', nullable: true })
    avgStar?: number;

    @ManyToMany(() => MediaEntity, { cascade: true })
    @JoinTable()
    areaMedias?: MediaEntity[];

    @ManyToOne(() => Cities, (cities) => cities.id, { primary: true })
    @JoinColumn({ name: 'city_id' })
    cities: Promise<Cities>;

    @OneToMany(() => HotelsRates, (rates) => rates.hotels, { primary: true })
    rates?: HotelsRates[]

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    constructor(partial: DeepPartial<Hotels>) {
      Object.assign(this, { id: snowflake.nextId(), ...partial });
    }
  }
  
  @ObjectType()
  export class HotelConnection extends PaginationBase(Hotels) {}

  @ObjectType({
    implements: [Node],
  })
  @Entity({
    name: 'hotels_rates',
  })
  export class HotelsRates implements Node {
    @Field(() => ID)
    @Column('bigint', {
      primary: true,
      unsigned: true,
    })
    id: string;
  
    @Column('bigint', { name: 'hotel_id' })
    hotelId: string;

    @Column('bigint', { name: 'user_id' })
    userId: string;

    @Column({  name: 'star', type: 'float' })
    star?: number;

    @Column({  type: 'text', nullable: true })
    comment?: string;

    @ManyToOne(() => Hotels, (hotels) => hotels.id, { primary: true })
    @JoinColumn({ name: 'hotel_id' })
    hotels: Cities;

    @ManyToOne(() => User, (user) => user.id, { primary: true })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
    users: User;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    constructor(partial: DeepPartial<HotelsRates>) {
      Object.assign(this, { id: snowflake.nextId(), ...partial });
    }
  }

  @ObjectType({
    implements: [Node],
  })
  @Entity({
    name: 'user_book_hotel',
  })
  export class UserBookHotel implements Node {
    @Field(() => ID)
    @Column('bigint', {
      primary: true,
      unsigned: true,
    })
    id: string;
  
    @Column('bigint', { name: 'hotel_id' })
    hotelId: string;

    @Column('bigint', { name: 'user_id' })
    userId: string;

    @Column({  name: 'total_price', type: 'float' })
    totalPrice?: number;

    @Column({  name: 'room_type', type: 'varchar', nullable : true })
    roomType?: string;

    @Column( { name: 'start_time', type: 'timestamp' })
    startTime: Date;

    @Column( { name: 'end_time', type: 'timestamp' })
    endTime: Date;

    @Column({  name: 'number_person', type: 'int' })
    numberPerson?: number;

    @ManyToOne(() => Hotels, (area) => area.id, { primary: true })
    @JoinColumn({ name: 'hotel_id' })
    hotels: Promise<Hotels>;

    @ManyToOne(() => User, (user) => user.id, { primary: true })
    @JoinColumn({ name: 'user_id' })
    users: Promise<User>;


    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;
    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
  
    constructor(partial: DeepPartial<UserBookHotel>) {
      Object.assign(this, { id: snowflake.nextId(), ...partial });
    }
  }
