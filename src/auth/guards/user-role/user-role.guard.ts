import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/role-protected.decorator';
import { User } from 'src/auth/entities/auth.entity';

@Injectable()
export class UserRoleGuard implements CanActivate {

  // Inyectar Reflector para acceder a los metadatos de los roles
  constructor(
    private readonly reflector: Reflector
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // Obtener los roles válidos del manejador de la ruta actual
    const validRoles: string [] = this.reflector.get(META_ROLES, context.getHandler());
    
    // Permitir el acceso si no hay roles definidos en el manejador
    if ( !validRoles ) return true;
    if ( validRoles.length === 0 ) return true;

    // Obtener la solicitud HTTP y el usuario de la solicitud
    const req = context.switchToHttp().getRequest();
    const user = req.user as User;

    // Lanzar una excepción si no se encuentra el usuario
    if(!user) throw new BadRequestException('User not found');

    // Imprimir en consola los roles del usuario (útil para depuración)
    console.log({ userRoles: user.roles});
    
    // Verificar si el usuario tiene alguno de los roles válidos
    for ( const role of user.roles ) {
      if ( validRoles.includes( role ) ) {
        return true; // Acceso permitido si se encuentra un rol válido
      }
    }

    // Lanzar una excepción si el usuario no tiene un rol válido
    throw new ForbiddenException(
      `User ${ user.name } needs a valid role: [${ validRoles }]`
    );
  }
}
