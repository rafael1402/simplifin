import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Usuario } from "../usuario-model";
import { UsuarioService } from "../usuario.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Component({
  selector: "app-dashboard",
  templateUrl: "./novo-usuario.component.html",
})
export class NovoUsuarioComponent implements OnInit {
  constructor(private usuarioService: UsuarioService, public router: Router) {}

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

  ngOnInit() {}

  novoUsuario(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const usuario: Usuario = {
      id: null,
      nomeCompleto: form.value.nomeCompleto,
      email: form.value.email,
      senha: form.value.senha,
      premium: 0,
    };

    this.isLoading = true;
    this.usuarioService.criarUsuario(usuario).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["/login"]);
        }
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
