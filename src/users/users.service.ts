import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);

  constructor(private supabaseService: SupabaseService) {}

  /**
   * Create a new user
   */
  async create(createUserDto: CreateUserDto) {
    try {
      const { email, password, displayName } = createUserDto;

      // Create user in Supabase Auth
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.createUser({
          email,
          password,
          user_metadata: { displayName },
          email_confirm: true, // Auto-confirm email
        });

      if (error) {
        this.logger.error(`Failed to create user: ${error.message}`);
        throw new BadRequestException(error.message);
      }

      return {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        user_metadata: data.user.user_metadata,
      };
    } catch (error: any) {
      this.logger.error(`Create user error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find all users
   */
  async findAll(page = 1, limit = 10) {
    try {
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.listUsers({
          page,
          perPage: limit,
        });

      if (error) {
        this.logger.error(`Failed to list users: ${error.message}`);
        throw new BadRequestException(error.message);
      }

      return {
        users: data.users.map(user => ({
          id: user.id,
          email: user.email,
          created_at: user.created_at,
          last_sign_in_at: user.last_sign_in_at,
          user_metadata: user.user_metadata,
        })),
        total: data.total || 0,
        page,
        limit,
      };
    } catch (error: any) {
      this.logger.error(`Find all users error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  async findOne(id: string) {
    try {
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.getUserById(id);

      if (error) {
        this.logger.error(`Failed to get user: ${error.message}`);
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return {
        id: data.user.id,
        email: data.user.email,
        created_at: data.user.created_at,
        last_sign_in_at: data.user.last_sign_in_at,
        user_metadata: data.user.user_metadata,
      };
    } catch (error: any) {
      this.logger.error(`Find user error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Update a user
   */
  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const updateData: any = {};
      
      if (updateUserDto.email) {
        updateData.email = updateUserDto.email;
      }
      
      if (updateUserDto.displayName) {
        updateData.user_metadata = { displayName: updateUserDto.displayName };
      }
      
      const { data, error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.updateUserById(id, updateData);

      if (error) {
        this.logger.error(`Failed to update user: ${error.message}`);
        throw new BadRequestException(error.message);
      }

      return {
        id: data.user.id,
        email: data.user.email,
        updated_at: new Date().toISOString(),
        user_metadata: data.user.user_metadata,
      };
    } catch (error: any) {
      this.logger.error(`Update user error: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Delete a user
   */
  async remove(id: string) {
    try {
      const { error } = await this.supabaseService
        .getAdminClient()
        .auth.admin.deleteUser(id);

      if (error) {
        this.logger.error(`Failed to delete user: ${error.message}`);
        throw new BadRequestException(error.message);
      }

      return {
        id,
        deleted: true,
        timestamp: new Date().toISOString(),
      };
    } catch (error: any) {
      this.logger.error(`Delete user error: ${(error as Error).message}`);
      throw error;
    }
  }
}