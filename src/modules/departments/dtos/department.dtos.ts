import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateIf,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { Field, InputType, Int } from '@nestjs/graphql';

import { config } from '@config';
import { DepartmentErrMsg } from '@const/department/error';

@InputType()
export class CreateDepartmentArgs {
  @Field()
  @Transform(({ value }: { value: any }) => {
    if (typeof value === 'string') return value.trim();
    return value;
  })
  @IsNotEmpty({ message: DepartmentErrMsg.EMPTY_NAME })
  @IsString({ message: DepartmentErrMsg.INVALID_NAME })
  name: string;

  @Field((type) => Int)
  @IsNumber({}, { message: DepartmentErrMsg.INVALID_FLOOR })
  @Min(1, { message: DepartmentErrMsg.MINIMUM_FLOOR })
  floor: number;

  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  @ValidateIf((dto) => typeof dto.email === 'string')
  @IsEmail({}, { message: DepartmentErrMsg.INVALID_EMAIL })
  email?: string;

  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  @ValidateIf((dto) => typeof dto.phoneNumber === 'string')
  @IsNotEmpty({ message: DepartmentErrMsg.EMPTY_PHONE_NUMBER })
  phoneNumber?: string;
}

@InputType()
export class UpdateDepartmentArgs {
  @Field()
  @IsUUID(config.UUID_VERSION, { message: DepartmentErrMsg.INVALID_ID })
  id: string;

  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  @ValidateIf((dto) => typeof dto.name !== 'undefined')
  @IsNotEmpty({ message: DepartmentErrMsg.EMPTY_NAME })
  name?: string;

  @Field((type) => Int, { nullable: true })
  @ValidateIf((dto) => typeof dto.floor !== 'undefined')
  @IsNumber({}, { message: DepartmentErrMsg.INVALID_FLOOR })
  @Min(1, { message: DepartmentErrMsg.MINIMUM_FLOOR })
  floor?: number;

  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  @ValidateIf((dto) => typeof dto.email === 'string')
  @IsEmail({}, { message: DepartmentErrMsg.INVALID_EMAIL })
  email?: string;

  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  @ValidateIf((dto) => typeof dto.phoneNumber === 'string')
  @IsNotEmpty({ message: DepartmentErrMsg.EMPTY_PHONE_NUMBER })
  phoneNumber?: string;
}

@InputType()
export class DepartmentFilterInput {
  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  email?: string;

  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsNumber({}, { message: DepartmentErrMsg.INVALID_FLOOR })
  @Min(1, { message: DepartmentErrMsg.MINIMUM_FLOOR })
  floor?: number;

  @Field({ nullable: true })
  @Transform(({ value }: { value: string }) => {
    if (value) return value.trim();
    return value;
  })
  phoneNumber?: string;
}
