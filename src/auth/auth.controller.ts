import { Controller, Get, Post, Body, UseGuards, Headers, Query, Delete, Patch, Param } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RawHeaders } from './decorators';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/auth.entity';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interface';
import { ApiTags, ApiResponse } from '@nestjs/swagger';
import { Auth } from './decorators/auth.decorator';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ParseMongoIdPipe } from 'src/common/pipes/parse-mongo-id.pipe';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiResponse({ status: 201, description: 'User registered' })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @ApiResponse({ status: 200, description: 'User logged in' })
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('check-status')
  @Auth()
  @ApiResponse({ status: 200, description: 'User status checked' })
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('users')
  @ApiResponse({ status: 200, description: 'List of users' })
  findAll(@Query() paginationDto: PaginationDto) {
    return this.authService.findAll(paginationDto);
  }

  @Get('user/:term')
  @ApiResponse({ status: 200, description: 'User found' })
  findOne(@Param('term') term: string) {
    return this.authService.findOne(term);
  }

  @Patch(':term')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'User updated' })
  update(@Param('term') term: string, @Body() updateUserDto: UpdateUserDto) {
    return this.authService.update(term, updateUserDto);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'User removed' })
  remove(@Param('id', ParseMongoIdPipe) id: string) {
    return this.authService.remove(id);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  @ApiResponse({ status: 200, description: 'Private route test' })
  testingPrivateRoute(
    @GetUser() user: User,
    @GetUser('email') usermail: string,
    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Private route',
      user,
      usermail,
      rawHeaders,
      headers,
    };
  }

  @Get('private2')
  @RoleProtected(ValidRoles.vendedor)
  @UseGuards(AuthGuard(), UserRoleGuard)
  @ApiResponse({ status: 200, description: 'Private route 2 test' })
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  @ApiResponse({ status: 200, description: 'Private route 3 test' })
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
