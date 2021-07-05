import { MinLength, MaxLength } from 'class-validator';
import { Field, Int, InputType } from '@nestjs/graphql';
import { ApiProperty } from '@nestjs/swagger';

// @InputType()
export class NewUserInput {
  @ApiProperty({ nullable: false })

  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({ nullable: false })

  password?: string;

  @ApiProperty({ nullable: false })

  email?: string;

  @ApiProperty({ nullable: false })

  firstName?: string;

  @ApiProperty({ nullable: false })

  lastName?: string;

  @ApiProperty({ nullable: false })

  @Field(() => Int)
  age?: number;

  roles?: string[];
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

  @ApiProperty({ nullable: true })
  roles?: string[];
}

export class SearchUserInput {
  @ApiProperty({nullable: true,required: false})
  keyword?: string;

  @ApiProperty({nullable: true, default: 1})
  page: number;

  @ApiProperty({nullable: true, default: 1})
  limit: number;
}

export class CheckLocationInput {
  @ApiProperty({nullable: true,required: false})
  id: string;

  @ApiProperty({nullable: true, default: 1})
  page: number;

  @ApiProperty({nullable: true, default: 1})
  limit: number;
}