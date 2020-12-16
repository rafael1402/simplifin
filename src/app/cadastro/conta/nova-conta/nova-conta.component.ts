import { Component, OnDestroy, OnInit } from "@angular/core";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Conta, OpcaoConta } from "../conta-model";
import { ContaService } from "../conta.service";

@Component({
  templateUrl: "./nova-conta.component.html",
})
export class NovaContaComponent implements OnInit {
  constructor(
    private contaService: ContaService,
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

  opcaoConta: OpcaoConta[] = this.contaService.getOpcaoConta();

  conta: Conta = {
    id: null,
    descricao: "",
    tipo: "C",
    status: 1,
  };

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {

      if (paramMap.has("id")) {
        this.edit = true;
        let id = paramMap.get("id");
        this.isLoading = true;
        this.contaService.buscarConta(id).subscribe(
          (retorno) => {
            this.isLoading = false;
            this.conta = {
              id: retorno.conta.id,
              descricao: retorno.conta.descricao,
              tipo: retorno.conta.tipo,
              status: retorno.conta.status,
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

  manterConta(form) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.contaService.manterConta(this.conta, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["/cadastro/conta"]);
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
