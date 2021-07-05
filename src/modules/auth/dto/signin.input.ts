import { ApiProperty } from "@nestjs/swagger";
import { MaxLength, MinLength } from "class-validator";

export class SigninInput {
    @ApiProperty({ nullable: false })

    @MinLength(3)
    @MaxLength(50)
    email: string;
  
    @ApiProperty({ nullable: false })
  
    password: string;
  
}