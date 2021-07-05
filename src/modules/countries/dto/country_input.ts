import { MinLength, MaxLength } from 'class-validator';
import { Field, Int, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

// @InputType()
export class NewCountryInput {
  @ApiProperty({ nullable: false })

  @MinLength(3)
  @MaxLength(50)
  countryName: string;

  @ApiProperty({ nullable: false })

  imageId: string[];

  @ApiProperty({ nullable: true })

  description: string;

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

export class SearchCountryInput {
  @ApiProperty({nullable: false,required: false})
  keyword?: string;

  @ApiProperty({nullable: true, default: 1})
  page: number;

  @ApiProperty({nullable: true, default: 1})
  limit: number;
}