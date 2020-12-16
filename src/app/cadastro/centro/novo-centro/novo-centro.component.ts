import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Centro } from "../centro-model";
import { CentroService } from "../centro.service";

@Component({
  templateUrl: "./novo-centro.component.html",
})
export class NovoCentroComponent implements OnInit {
  constructor(
    private centroService: CentroService,
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



  centro: Centro = {
    id: null,
    descricao: "",
    status: 1,
  };

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has("id")) {
        this.edit = true;
        let id = paramMap.get("id");
        this.isLoading = true;
        this.centroService.buscarCentro(id).subscribe(
          (retorno) => {
            this.isLoading = false;
            this.centro = {
              id: retorno.centro.id,
              descricao: retorno.centro.descricao,
              status: retorno.centro.status,
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

  manterCentro(form) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.centroService.manterCentro(this.centro, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["/cadastro/centro"]);
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
