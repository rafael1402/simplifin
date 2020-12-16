/*Esse interceptor tem a função de interceptar todas as requisições HTTP
e incluir o token antes de enviar para o servidor*/

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AutenticacaoService } from './autenticacao.service';

@Injectable()
export class AutenticacaoInterceptor implements HttpInterceptor {
  constructor(private autenticacaoService: AutenticacaoService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.autenticacaoService.getToken();
    const authRequest = req.clone({
      headers: req.headers.set('Authorazation', `Bearer ${authToken}`),
    });
    return next.handle(authRequest);
  }
}
