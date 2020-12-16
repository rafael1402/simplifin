import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { UsuarioService } from "../usuario.service";
import Swal from "sweetalert2";

@Component({
  templateUrl: "./editar-senha.component.html",
})
export class editarSenhaComponent {
  constructor(private usuarioService: UsuarioService) {}

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

  isLoading = false;

  editarSenha(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;
    this.usuarioService
      .atualizarSenha(form.value.senhaAtual, form.value.novaSenha)
      .subscribe(
        (retorno) => {
          this.isLoading = false;

          if (retorno.status === "OK") {
            form.reset();
          }

          this.Toast.fire({
            text: retorno.mensagem,
            icon: retorno.status === "OK" ? "success" : "error",
          });
        },
        (error) => {
          this.isLoading = false;
          console.log(error);

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
