import { Component, OnInit } from "@angular/core";
import { UsuarioService } from "../usuario.service";
import Swal from "sweetalert2";
import { Usuario } from "../usuario-model";
import { NgForm } from "@angular/forms";
import { AutenticacaoService } from "../../autenticacao/autenticacao.service";

@Component({
  templateUrl: "./editar-usuario.component.html",
})
export class AlterarUsuarioComponent implements OnInit {
  constructor(
    private usuarioService: UsuarioService,
    private autenticacaoService: AutenticacaoService
  ) {}

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

  usuario: Usuario = {
    id: null,
    nomeCompleto: "",
    email: "",
    senha: "",
    premium: 0,
  };
  isLoading = false;

  ngOnInit() {
    this.isLoading = true;
    this.usuarioService.buscarUsuario().subscribe(
      (retorno) => {
        this.isLoading = false;
        this.usuario = {
          id: null,
          nomeCompleto: retorno.nomeCompleto,
          email: retorno.email,
          senha: "",
          premium: retorno.premium,
        };
      },
      (error) => {
        this.isLoading = false;
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

  atualizarUsuario(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.usuarioService
      .atualizarUsuario(this.usuario.nomeCompleto, this.usuario.email)
      .subscribe(
        (retorno) => {
          this.isLoading = false;

          this.Toast.fire({
            text: retorno.mensagem,
            icon: retorno.status === "OK" ? "success" : "error",
          });
        },
        (error) => {
          this.isLoading = false;

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

  ativarPremium() {
    var premium = this.usuario.premium === 0 ? 1 : 0;

    var msg =
      this.usuario.premium === 0
        ? "A conta Premium tem acesso a funcionalidade de metas onde é possível cadastrar e acompanhar suas metas de economias. " +
          "Assim você nunca mais perderá o controle de suas desepsas."
        : "Desativando a conta Premium você pederá o acesso a suas metas.";

    Swal.fire({
      title: "Conta Premium",
      text: `${msg} Ao confirmar você será redirecionado para tela de login.`,
      icon: "info",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Confirmar",
    }).then((result) => {
      if (result.isConfirmed) {
        this.autenticacaoService.ativarPremium(premium);
      }
    });
  }
}
