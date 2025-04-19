import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';
import { MessageDto } from './dto/message.dto';
import { LocationUpdateDto } from './dto/location-update.dto';
import { ApiService } from './api.service';

@ApiTags('API')
@Controller('api')
@ApiBearerAuth('JWT')
export class ApiController {
  constructor(private readonly apiService: ApiService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiResponse({ status: 200, description: 'Return user profile' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getProfile(@Request() req: any) {
    // The user object is attached to the request by the AuthGuard
    return {
      id: req.user.id,
      email: req.user.email,
      user_metadata: req.user.user_metadata,
      app_metadata: req.user.app_metadata,
    };
  }

  @Post('message')
  @ApiOperation({ summary: 'Send a message' })
  @ApiResponse({ status: 201, description: 'Message sent' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  sendMessage(@Request() req: any, @Body() messageDto: MessageDto) {
    return {
      status: 'success',
      message: 'Message received',
      content: messageDto.content,
      userId: req.user.id,
      timestamp: new Date().toISOString(),
    };
  }

  @Post('user-location-updates')
  @ApiOperation({ summary: 'Update user location' })
  @ApiResponse({ status: 200, description: 'Location updated successfully' })
  @ApiResponse({ status: 400, description: 'Invalid location data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 500, description: 'Server error' })
  async updateLocation(@Request() req: any, @Body() locationDto: LocationUpdateDto) {
    return this.apiService.updateLocation(req.user.id, locationDto);
  }
}