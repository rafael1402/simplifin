import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { FormaPagamento } from "../forma-pagamento-model";
import { FormaPagamentoService } from "../forma-pagamento.service";

@Component({
  templateUrl: "./nova-forma-pagamento.component.html",
})
export class NovaFormaPagamentoComponent implements OnInit {
  constructor(
    private formaPagamentoService: FormaPagamentoService,
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



  formaPagamento: FormaPagamento = {
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
        this.formaPagamentoService.buscarFormaPagamento(id).subscribe(
          (retorno) => {
            this.isLoading = false;
            this.formaPagamento = {
              id: retorno.formaPagamento.id,
              descricao: retorno.formaPagamento.descricao,
              status: retorno.formaPagamento.status,
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

  manterFormaPagamento(form) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;

    this.formaPagamentoService.manterFormaPagamento(this.formaPagamento, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["/cadastro/forma-pagamento"]);
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
