import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";

import Swal from "sweetalert2";
import { Subject } from "rxjs";

import { environment } from "../../environments/environment";
import { SocialAuthService } from "angularx-social-login";

const BACKEND_URL = `${environment.apiUrl}/usuario`;

@Injectable({ providedIn: "root" })
export class AutenticacaoService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private authService: SocialAuthService
  ) {}

  private token: string;
  private tokenTimer: any;
  private usuarioAutenticado: boolean;
  private usuarioPremium: boolean;
  private autStatusListener = new Subject<boolean>();

  private Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener("mouseenter", Swal.stopTimer);
      toast.addEventListener("mouseleave", Swal.resumeTimer);
    },
  });

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  getToken() {
    return this.token;
  }

  getAuthStatus() {
    return this.usuarioAutenticado;
  }

  getPremium() {
    if (typeof this.usuarioPremium === "undefined") {
      const autenticacaoInfo = this.getAuthData();
      return this.usuarioPremium = +autenticacaoInfo.premium == 0 ? false : true;
    } else {
      return this.usuarioPremium;
    }
  }

  getAuthStatusListener() {
    return this.autStatusListener.asObservable();
  }

  login(email: string, senha: string) {
    this.http
      .post<{
        mensagem: string;
        status: string;
        token: string;
        expiraEm: number;
        usuarioId: string;
        nomeCompleto: string;
        premium: number;
      }>(`${BACKEND_URL}/login`, {
        email: email,
        senha: senha,
      })
      .subscribe(
        (retorno) => {
          this.token = retorno.token;

          if (this.token) {
            this.setAuthTimer(retorno.expiraEm);
            this.usuarioPremium = retorno.premium == 0 ? false : true;
            this.usuarioAutenticado = true;
            this.autStatusListener.next(true);
            const dateNow = new Date().getTime();
            const validade = new Date(dateNow + retorno.expiraEm * 1000);
            this.saveAuthData(this.token, validade, retorno.usuarioId, retorno.premium.toString());
            this.router.navigate(["/"]);
          } else {
            this.Toast.fire({
              text: retorno.mensagem,
              icon: retorno.status === "OK" ? "success" : "error",
            });
          }
        },
        (error) => {
          console.log(error);
          this.Toast.fire({
            text: error.error.mensagem,
            icon: error.error.status === "OK" ? "success" : "error",
          });
          this.usuarioAutenticado = false;
          this.autStatusListener.next(false);
        }
      );
  }

  socialLogin(user: any) {
    this.http
      .post<{
        mensagem: string;
        status: string;
        token: string;
        expiraEm: number;
        usuarioId: string;
        nomeCompleto: string;
        premium: number;
      }>(`${BACKEND_URL}/social-login`, user)
      .subscribe(
        (retorno) => {
          this.token = retorno.token;

          if (this.token) {
            this.setAuthTimer(retorno.expiraEm);
            this.usuarioAutenticado = true;
            this.usuarioPremium = retorno.premium == 0 ? false : true;
            this.autStatusListener.next(true);
            const dateNow = new Date().getTime();
            const validade = new Date(dateNow + retorno.expiraEm * 1000);
            this.saveAuthData(this.token, validade, retorno.usuarioId, retorno.premium.toString());
            this.router.navigate(["/"]);
          } else {
            this.Toast.fire({
              text: retorno.mensagem,
              icon: retorno.status === "OK" ? "success" : "error",
            });
          }
        },
        (error) => {
          console.log(error);
          this.Toast.fire({
            text:
              typeof error.error.mensagem === "undefined"
                ? error.message
                : error.error.mensagem,
            icon: error.status === "OK" ? "success" : "error",
          });
          this.usuarioAutenticado = false;
          this.autStatusListener.next(false);
        }
      );
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.token = null;
    this.usuarioAutenticado = false;
    this.usuarioPremium = false;
    this.autStatusListener.next(false);
    this.clearAuthData();

    this.authService.signOut().finally(() => {
      this.router.navigate(["/login"]);
    });
  }

  autenticarUsuario() {
    const autenticacaoInfo = this.getAuthData();

    if (!autenticacaoInfo) {
      this.logout();
      return;
    }

    const dateNow = new Date();
    const validade = autenticacaoInfo.validade.getTime() - dateNow.getTime();
    if (validade > 0) {
      this.token = autenticacaoInfo.token;
      this.usuarioAutenticado = true;
      this.setAuthTimer(validade / 1000);
      this.autStatusListener.next(true);
    }
  }

  private saveAuthData(
    token: string,
    expirationDate: Date,
    usuarioId: string,
    premium: string
  ) {
    localStorage.setItem("token", token);
    localStorage.setItem("usuarioId", usuarioId);
    localStorage.setItem("validade", expirationDate.toISOString());
    localStorage.setItem("premium", premium);
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const validade = localStorage.getItem("validade");
    const usuarioId = localStorage.getItem("usuarioId");
    const premium = localStorage.getItem("premium");

    if (!token || !validade || !usuarioId || !premium) {
      return;
    }
    return {
      token: token,
      usuarioId: usuarioId,
      validade: new Date(validade),
      premium: premium,
    };
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("validade");
    localStorage.removeItem("usuarioId");
    localStorage.removeItem("premium");
  }

  ativarPremium(premium: number) {
    return this.http
      .patch<{
        mensagem: string;
        status: string;
        retorno: string;
      }>(`${BACKEND_URL}/ativar-premium`, {
        premium: premium,
      })
      .subscribe(
        (retorno) => {
          if (retorno.status === "OK") {
            premium == 0
              ? (this.usuarioPremium = false)
              : (this.usuarioPremium = true);
            this.logout();
          }
        },
        (error) => {
          this.Toast.fire({
            text:
              typeof error.error.mensagem === "undefined"
                ? error.message
                : error.error.mensagem,
            icon: error.status === "OK" ? "success" : "error",
          });
        }
      );
  }
}
