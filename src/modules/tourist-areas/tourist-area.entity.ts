import {
  Entity,
  Column,
  DeepPartial,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToMany,
  JoinTable,
  ManyToOne,
  JoinColumn,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ObjectType, Field, Int, HideField, ID } from "@nestjs/graphql";
import {
  Node,
  PaginationBase,
} from "src/graphql/types/common.interface.entity";
import { snowflake } from "src/helpers/common";
import { MediaEntity } from "../media/entities/media.entity";
import { Cities } from "../cities/citites.entity";
import { User } from "../users/entities/users.entity";

export enum StatusTour {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

@ObjectType({
  implements: [Node],
})
@Entity({
  name: "tourist_areas",
})
export class TouristArea implements Node {
  @Field(() => ID)
  @Column("bigint", {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column({ length: 50, name: "area_name" })
  areaName: string;

  @Column("bigint", { name: "city_id" })
  cityId: string;

  @Column({ name: "price", type: "float" })
  price?: number;

  @Column({ name: "description", type: "text", nullable: true })
  description?: string;

  @Column({ name: "number_person", type: "int", nullable: true })
  numberPerson?: number;

  @Column({ name: "avg_star", type: "float", nullable: true })
  avgStar?: number;

  @ManyToMany(() => MediaEntity, { cascade: true })
  @JoinTable()
  areaMedias?: MediaEntity[];

  @ManyToOne(() => Cities, (cities) => cities.id, { primary: true })
  @JoinColumn({ name: "city_id" })
  cities: Promise<Cities>;

  @OneToMany(() => TouristAreasRates, (rates) => rates.touristAreas, {
    primary: true,
  })
  rates?: TouristAreasRates[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  constructor(partial: DeepPartial<TouristArea>) {
    Object.assign(this, { id: snowflake.nextId(), ...partial });
  }
}

@ObjectType()
export class TouristAreaConnection extends PaginationBase(TouristArea) {}

@ObjectType({
  implements: [Node],
})
@Entity({
  name: "user_book_tour",
})
export class UserBookTour implements Node {
  @Field(() => ID)
  @Column("bigint", {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column("bigint", { name: "area_id" })
  areaId: string;

  @Column("bigint", { name: "user_id" })
  userId: string;

  @Column({ name: "total_price", type: "float" })
  totalPrice?: number;

  @Column({ name: "start_time", type: "timestamp" })
  startTime: Date;

  @Column({ name: "end_time", type: "timestamp" })
  endTime: Date;

  @Column({ name: "number_person", type: "int" })
  numberPerson?: number;

  @ManyToOne(() => TouristArea, (area) => area.id, { primary: true })
  @JoinColumn({ name: "area_id" })
  areas: Promise<TouristArea>;

  @ManyToOne(() => User, (user) => user.id, { primary: true })
  @JoinColumn({ name: "user_id" })
  users: Promise<User>;

  @Column({
    nullable: false,
    type: "enum",
    enum: StatusTour,
    default: StatusTour.PENDING,
  })
  status: StatusTour;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  constructor(partial: DeepPartial<UserBookTour>) {
    Object.assign(this, { id: snowflake.nextId(), ...partial });
  }
}

@ObjectType({
  implements: [Node],
})
@Entity({
  name: "payment_card",
})
export class PaymentCard implements Node {
  @Field(() => ID)
  @Column("bigint", {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column("bigint", { name: "user_id" })
  userId: string;

  @Column({ name: "card_number", type: "varchar" })
  cardNumber?: string;

  @Column({ name: "card_owner", type: "varchar" })
  cardOwner: string;

  @Column({ name: "card_type", type: "varchar" })
  cardType?: number;

  @ManyToOne(() => User, (user) => user.id, { primary: true })
  @JoinColumn({ name: "user_id" })
  users: Promise<User>;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  constructor(partial: DeepPartial<PaymentCard>) {
    Object.assign(this, { id: snowflake.nextId(), ...partial });
  }
}

@ObjectType({
  implements: [Node],
})
@Entity({
  name: "user_location",
})
export class UserLocation implements Node {
  @Field(() => ID)
  @Column("bigint", {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column({ name: "user_id", type: "varchar" })
  userId: string;

  @Column({ name: "location", type: "jsonb", nullable: true })
  location?: any;

  @Column({ name: "weather", type: "jsonb", nullable: true })
  weather?: any;

  @ManyToOne(() => User, (user) => user.id, { primary: true })
  @JoinColumn({ name: "user_id" })
  users: Promise<User>;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  constructor(partial: DeepPartial<UserLocation>) {
    Object.assign(this, { id: snowflake.nextId(), ...partial });
  }
}

@ObjectType({
  implements: [Node],
})
@Entity({
  name: "tourist_areas_rates",
})
export class TouristAreasRates implements Node {
  @Field(() => ID)
  @Column("bigint", {
    primary: true,
    unsigned: true,
  })
  id: string;

  @Column("bigint", { name: "tourist_areas_id" })
  touristAreasId: string;

  @Column("bigint", { name: "user_id" })
  userId: string;

  @Column({ name: "star", type: "float" })
  star?: number;

  @Column({ type: "text", nullable: true })
  comment?: string;

  @ManyToOne(() => TouristArea, (touristArea) => touristArea.id, {
    primary: true,
  })
  @JoinColumn({ name: "tourist_areas_id" })
  touristAreas: TouristArea;

  @ManyToOne(() => User, (user) => user.id, { primary: true })
  @JoinColumn({ name: "user_id", referencedColumnName: 'id' })
  users: User;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  constructor(partial: DeepPartial<TouristAreasRates>) {
    Object.assign(this, { id: snowflake.nextId(), ...partial });
  }
}
