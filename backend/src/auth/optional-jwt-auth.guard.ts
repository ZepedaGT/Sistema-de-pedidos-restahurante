import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Si hay token válido, req.user trae el usuario.
 * Si no hay token (o es inválido), deja pasar y req.user = null (invitado).
 */
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest<TUser = any>(_err: any, user: TUser | false): TUser | null {
    return user || null;
  }
}