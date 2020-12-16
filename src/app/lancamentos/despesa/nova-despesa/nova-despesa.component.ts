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
import { Despesa, RepeticaoTipo } from "../despesa-model";
import { DespesaService } from "../despesa.service";

import * as moment from "moment";
//import * as localization from 'moment/locale/pt-br';
moment.locale("pt-br");

@Component({
  templateUrl: "./nova-despesa.component.html",
  styles: [
    `
      /deep/ .ngx-select__selected-plural {
        background-color: white !important;
        border-color: white !important;
      }
    `,
  ],
})
export class NovaDespesaComponent implements OnInit {
  constructor(
    private despesaService: DespesaService,
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

  repeticaoTipo: RepeticaoTipo[] = this.despesaService.getRepeticaoTipo();
  categorias: Categoria[];
  contas: Conta[];
  formasPagamento: FormaPagamento[];
  tags: Tag[];
  centros: Centro[];

  despesa: Despesa;
  dtDespesa: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment(),
    endDate: moment(),
  };

  opcao: any[] = [
    { id: 0, valor: "Não" },
    { id: 1, valor: "Sim" },
  ];

  controleRateio: number;

  validaPercentual(){
    return this.despesa.percentualRateio > 100 ? false : true
  }

  resetForm() {
    this.despesa = {
      _id: null,
      categoria: "",
      conta: "",
      data: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate()
      ),
      baixado: 0,
      descricao: "",
      observacao: "",
      documento: "",
      repeticao: 0,
      repeticaoTipo: "U",
      valor: null,
      formaPagamento: "",
      centro: "",
      percentualRateio: null,
      valorRateio: null,
      tag: [],
    };
    this.controleRateio = 0;
  }

  ngOnInit() {
    this.resetForm();

    this.categoriaService.listarCategoriasSelect("D").subscribe((ret) => {
      this.categorias = ret.categorias;
    });
    this.contaService.listarContasSelect().subscribe((ret) => {
      this.contas = ret.contas;
    });
    this.tagService.listarTagsSelect().subscribe((ret) => {
      this.tags = ret.tags;
    });
    this.formaPagamentoService
      .listarFormasPagamentoSelect()
      .subscribe((ret) => {
        this.formasPagamento = ret.formasPagamento;
      });
    this.centroService.listarCentrosSelect().subscribe((ret) => {
      this.centros = ret.centros;
    });

    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.edit = true;
        let id = paramMap.get("id");
        this.isLoading = true;
        this.despesaService.buscarDespesa(id).subscribe(
          (retorno) => {
            this.despesa = retorno.despesa;
            this.dtDespesa = {
              startDate: moment(retorno.despesa.data),
              endDate: moment(retorno.despesa.data),
            };
            this.controleRateio = this.despesa.centro ? 1 : 0
            this.isLoading = false;
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
      } else {
        this.edit = false;
      }
    });
  }

  manterDespesa(form) {
    if (form.invalid) {
      return;
    }

    if(this.controleRateio == 0 ){
      this.despesa.percentualRateio = 0;
      this.despesa.centro = null;
      this.despesa.valorRateio = 0;
    }

    this.isLoading = true;

    this.despesa.data = this.dtDespesa.startDate.toDate();
    this.despesa.data.setHours(0, 0, 0, 0);

    this.despesaService.manterDespesa(this.despesa, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["../lancamentos/despesas"]);
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
