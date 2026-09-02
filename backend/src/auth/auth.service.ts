import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

const USUARIO_SELECT = {
  id_usuario: true,
  nombre: true,
  correo: true,
  telefono: true,
  foto: true,
};

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const usuarioExistente = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (usuarioExistente) {
      throw new ConflictException('Ya existe un usuario con este correo');
    }

    const passwordHasheado = await bcrypt.hash(dto.password, 10);

    const usuario = await this.prisma.usuario.create({
      data: {
        nombre: dto.nombre,
        correo: dto.correo,
        password: passwordHasheado,
        telefono: dto.telefono,
        foto: dto.foto,
      },
      select: USUARIO_SELECT,
    });

    const token = await this.generarToken(usuario.id_usuario, usuario.correo);

    return {
      usuario,
      ...token,
    };
  }

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { correo: dto.correo },
    });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const passwordValido = await bcrypt.compare(dto.password, usuario.password);

    if (!passwordValido) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const token = await this.generarToken(usuario.id_usuario, usuario.correo);

    const usuarioSinPassword = await this.prisma.usuario.findUnique({
      where: { id_usuario: usuario.id_usuario },
      select: USUARIO_SELECT,
    });

    return {
      usuario: usuarioSinPassword,
      ...token,
    };
  }

  async validarUsuario(id_usuario: number) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id_usuario },
      select: USUARIO_SELECT,
    });

    if (!usuario) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return usuario;
  }

  private async generarToken(id_usuario: number, correo: string) {
    const payload = { sub: id_usuario, correo };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
