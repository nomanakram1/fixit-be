import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcryptjs';
import { SignupDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async signup(signupDto: SignupDto): Promise<{ message: string }> {
    const { username, email, password } = signupDto;

    // Check if user already exists
    const existingUser = await this.userService.findOneByEmail(email) || await this.userService.findOneByUsername(username);
    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create and save the user
    await this.userService.create({
      username,
      email,
      password,
    });

    return { message: 'User registered successfully.' };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const resetToken = this.jwtService.sign({ sub: user.id }, { expiresIn: '1h' });
    // Ideally, send this token via email
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    return { message: 'Password reset link sent successfully.' };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findOne(decoded.sub);
      
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await this.userService.save(user);

      return { message: 'Password reset successfully.' };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }
}