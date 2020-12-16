import { Component, OnDestroy, OnInit } from "@angular/core";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Categoria } from "../../../cadastro/categoria/categoria-model";
import { CategoriaService } from "../../../cadastro/categoria/categoria.service";
import { Centro } from "../../../cadastro/centro/centro-model";
import { CentroService } from "../../../cadastro/centro/centro.service";
import { Conta } from "../../../cadastro/conta/conta-model";
import { ContaService } from "../../../cadastro/conta/conta.service";
import { FormaPagamento } from "../../../cadastro/forma-pagamento/forma-pagamento-model";
import { FormaPagamentoService } from "../../../cadastro/forma-pagamento/forma-pagamento.service";
import { Tag } from "../../../cadastro/tag/tag-model";
import { TagService } from "../../../cadastro/tag/tag.service";
import { Transferencia, RepeticaoTipo } from "../transferencia-model";
import { TransferenciaService } from "../transferencia.service";

import * as moment from "moment";
//import * as localization from 'moment/locale/pt-br';
moment.locale("pt-br");

@Component({
  templateUrl: "./nova-transferencia.component.html",
  styles: [
    `
      /deep/ .ngx-select__selected-plural {
        background-color: white !important;
        border-color: white !important;
      }
    `,
  ],
})
export class NovaTransferenciaComponent implements OnInit {
  constructor(
    private transferenciaService: TransferenciaService,
    private categoriaService: CategoriaService,
    private contaService: ContaService,
    private formaPagamentoService: FormaPagamentoService,
    private tagService: TagService,
    private centroService: CentroService,
    public activeRouter: ActivatedRoute,
    public router: Router
  ) {}

  locale: any = {
    applyLabel: "Appliquer",
    customRangeLabel: " - ",
    daysOfWeek: moment.weekdaysMin(),
    monthNames: moment.monthsShort(),
    firstDay: moment.localeData().firstDayOfWeek(),
  };

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

  repeticaoTipo: RepeticaoTipo[] = this.transferenciaService.getRepeticaoTipo();
  categorias: Categoria[];
  contas: Conta[];
  tags: Tag[];

  transferencia: Transferencia;
  dtTransferencia: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment(),
    endDate: moment(),
  };

  opcao: any[] = [
    { id: 0, valor: "Não" },
    { id: 1, valor: "Sim" },
  ];

  resetForm() {
    this.transferencia = {
      _id: null,
      contaOrigem: "",
      contaDestino: "",
      data: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      descricao: "",
      observacao: "",
      documento: "",
      repeticao: 0,
      repeticaoTipo: "U",
      valor: null,
      tag: [],
    };
  }

  ngOnInit() {
    this.resetForm();

    this.categoriaService.listarCategoriasSelect("R").subscribe((ret) => {
      this.categorias = ret.categorias;
    });
    this.contaService.listarContasSelect().subscribe((ret) => {
      this.contas = ret.contas;
    });
    this.tagService.listarTagsSelect().subscribe((ret) => {
      this.tags = ret.tags;
    });

    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.edit = true;
        let id = paramMap.get("id");
        this.isLoading = true;
        this.transferenciaService.buscarTransferencia(id).subscribe(
          (retorno) => {
            this.transferencia = retorno.transferencia;
            this.dtTransferencia = {
              startDate: moment(retorno.transferencia.data),
              endDate: moment(retorno.transferencia.data),
            };
            this.isLoading = false;
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

  manterTransferencia(form) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    this.transferencia.data = this.dtTransferencia.startDate.toDate();
    this.transferencia.data.setHours(0, 0, 0, 0);

    this.transferenciaService.manterTransferencia(this.transferencia, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["../lancamentos/transferencias"]);
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
