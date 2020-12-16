import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Categoria, OpcaoCategoria } from "../categoria-model";
import { CategoriaService } from "../categoria.service";

@Component({
  templateUrl: "./nova-categoria.component.html",
})
export class NovaCategoriaComponent implements OnInit {
  constructor(
    private categoriaService: CategoriaService,
    public activeRouter: ActivatedRoute,
    public router: Router
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

  isLoading: boolean = false;
  edit: boolean = false;

  opcaoCategoria: OpcaoCategoria[] = this.categoriaService.getOpcaoCategoria();

  categoria: Categoria = {
    id: null,
    descricao: "",
    tipo: "R",
    status: 1,
  };

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.edit = true;
        let id = paramMap.get("id");
        this.isLoading = true;
        this.categoriaService.buscarCategoria(id).subscribe(
          (retorno) => {
            this.isLoading = false;
            this.categoria = {
              id: retorno.categoria.id,
              descricao: retorno.categoria.descricao,
              tipo: retorno.categoria.tipo,
              status: retorno.categoria.status,
            };
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
      } else {
        this.edit = false;
      }
    });
  }

  manterCategoria(form) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.categoriaService.manterCategoria(this.categoria, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["/cadastro/categoria"]);
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
