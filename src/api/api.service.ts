import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { LocationUpdateDto } from './dto/location-update.dto';

@Injectable()
export class ApiService {
  private readonly logger = new Logger(ApiService.name);

  constructor(private readonly supabaseService: SupabaseService) {}

  async updateLocation(userId: string, locationData: LocationUpdateDto) {
    try {
      const { latitude, longitude, accuracy, locationType } = locationData;

      // Convert lat/long to PostGIS point format
      const point = `POINT(${longitude} ${latitude})`;

      const { data, error } = await this.supabaseService
        .getClient()
        .from('user_locations')
        .upsert(
          {
            user_id: userId,
            location: point,
            accuracy,
            location_type: locationType,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'user_id'
          },
        );

      if (error) {
        this.logger.error(`Failed to update location: ${error.message}`);
        throw new InternalServerErrorException('Failed to update location');
      }

      return {
        status: 'success',
        message: 'Location updated successfully',
        data,
      };
    } catch (error: any) {
      this.logger.error(`Location update error: ${error.message}`);
      throw error;
    }
  }
}