/*Essa classe serve para proteger as rotas do app,
redirecionando o acesso caso necessário*/

import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';

import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { AutenticacaoService } from './autenticacao.service';

@Injectable()
export class AutenticacaoGuard implements CanActivate {
  /*Não esquecer de informar se o objeto do construtor é public ou privado*/
  constructor(private autenticacaoService: AutenticacaoService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean | Observable<boolean> | Promise<boolean> {
    const isAuth = this.autenticacaoService.getAuthStatus();
    if (!isAuth) {
      this.router.navigate(['/login']);
    }
    return isAuth;
  }
}
