import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Usuario } from "./usuario-model";
import { Router } from "@angular/router";
import { environment } from "../../environments/environment";
import Swal from "sweetalert2";
import { AutenticacaoService } from '../autenticacao/autenticacao.service';
const BACKEND_URL = `${environment.apiUrl}/usuario`;

@Injectable({ providedIn: "root" })
export class UsuarioService {
  constructor(private http: HttpClient, private router: Router, private autenticacaoService: AutenticacaoService) {}

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

  //private apiUrl: string = "http://localhost:3000";

  criarUsuario(usuario: Usuario) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, usuario);
  }

  buscarUsuario() {
    return this.http.get<{
      nomeCompleto: string;
      email: string;
      premium: number;
    }>(BACKEND_URL);
  }

  atualizarUsuario(nomeCompleto: string, email: string) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, {
      nomeCompleto: nomeCompleto,
      email: email,
    });
  }

  atualizarSenha(senhaAtual: string, novaSenha: string) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(`${BACKEND_URL}/atualizar-senha`, {
      senhaAtual: senhaAtual,
      novaSenha: novaSenha,
    });
  }
}
