import { IsNumber, IsString, IsEnum, IsOptional, Min, Max } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum LocationType {
  PRECISE = 'precise',
  NEARBY = 'nearby',
  HIDDEN = 'hidden',
}

export class LocationUpdateDto {
  @ApiProperty({
    description: 'Latitude coordinate',
    example: 37.7749,
    minimum: -90,
    maximum: 90,
  })
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude?: number;

  @ApiProperty({
    description: 'Longitude coordinate',
    example: -122.4194,
    minimum: -180,
    maximum: 180,
  })
  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude?: number;

  @ApiProperty({
    description: 'Accuracy of the location in meters',
    example: 10,
    required: false,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  accuracy?: number;

  @ApiProperty({
    description: 'Type of location sharing',
    enum: LocationType,
    example: LocationType.PRECISE,
  })
  @IsEnum(LocationType)
  locationType?: LocationType;
}