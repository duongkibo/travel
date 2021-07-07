import { MinLength, MaxLength } from 'class-validator';
import { Field, Int, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

// @InputType()
export class NewAreaInput {
  @ApiProperty({ nullable: false })

  @MinLength(3)
  @MaxLength(50)
  areaName: string;

  @ApiProperty({ nullable: false })

  imageId: string[];

  @ApiProperty({ nullable: false })

  cityId: string;

  @ApiProperty({ nullable: false })

  description: string;

  @ApiProperty({ nullable: false })

  price: number;

}

export class UpdateUserInput {
  @ApiProperty({ nullable: false })

  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ nullable: false })

  password?: string;

  @ApiProperty({ nullable: false })

  firstName?: string;

  @ApiProperty({ nullable: false })

  lastName?: string;

  @ApiProperty({ nullable: false })

  @Field(() => Int)
  age?: number;

  roles?: string[];
}

export class SearchAreaInput {
  @ApiProperty({nullable: false,required: false})
  keyword?: string;

  @ApiProperty({nullable: true, default: 1})
  page: number;

  @ApiProperty({nullable: true, default: 1})
  limit: number;
}

export class BookAreaInput {
  @ApiProperty({nullable: false,required: false})
  startTime: string;

  @ApiProperty({nullable: false})
  endTime: string;

  @ApiProperty({nullable: false})
  numberPerson: number;

  @ApiProperty({nullable: false})
  areaId: string ;
}

export class PaymentCardInput {
  @ApiProperty({nullable: false,required: false})
  cardNumber: string;

  @ApiProperty({nullable: false})
  cardOwnner: string;

  @ApiProperty({nullable: false})
  cardType: number;

}

export class LocationInput {
  @ApiProperty({nullable: false,required: false})
  location: string;
  tokenOfFCM?: string;
}

export class RateTouristAreaInput {
  @ApiProperty({nullable: false,required: true})
  touristAreasId: string;

  @ApiProperty({nullable: true, default: 1})
  star: number;

  @ApiProperty({nullable: true, default: 1})
  comment?: string;

}