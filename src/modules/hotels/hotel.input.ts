import { MinLength, MaxLength } from 'class-validator';
import { Field, Int, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

// @InputType()
export class NewHotelInput {
  @ApiProperty({ nullable: false })

  @MinLength(3)
  @MaxLength(50)
  hotelName: string;

  @ApiProperty({ nullable: false })

  imageId: string[];

  @ApiProperty({ nullable: false })

  cityId: string;

  @ApiProperty({ nullable: true })

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

export class SearchHotelInput {
  @ApiProperty({nullable: false,required: false})
  keyword?: string;

  @ApiProperty({nullable: true, default: 1})
  page: number;

  @ApiProperty({nullable: true, default: 1})
  limit: number;
}

export class RateHotelInput {
  @ApiProperty({nullable: false,required: false})
  hotelId: string;

  @ApiProperty({nullable: true, default: 1})
  star: number;

  @ApiProperty({nullable: true, default: 1})
  comment?: string;

}

export class UserBookHotelInput {
  @ApiProperty({nullable: false,required: false})
  hotelId: string;

  @ApiProperty({nullable: false,required: false})
  startTime: string;

  @ApiProperty({nullable: false})
  endTime: string;

  @ApiProperty({nullable: false})
  numberPerson: number;

  @ApiProperty({nullable: false})
  roomType: string;
}