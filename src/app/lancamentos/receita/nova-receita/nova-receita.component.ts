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
import { Receita, RepeticaoTipo } from "../receita-model";
import { ReceitaService } from "../receita.service";

import * as moment from "moment";
//import * as localization from 'moment/locale/pt-br';
moment.locale("pt-br");

@Component({
  templateUrl: "./nova-receita.component.html",
  styles: [
    `
      /deep/ .ngx-select__selected-plural {
        background-color: white !important;
        border-color: white !important;
      }
    `,
  ],
})
export class NovaReceitaComponent implements OnInit {
  constructor(
    private receitaService: ReceitaService,
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

  repeticaoTipo: RepeticaoTipo[] = this.receitaService.getRepeticaoTipo();
  categorias: Categoria[];
  contas: Conta[];
  tags: Tag[];

  receita: Receita;
  dtReceita: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment(),
    endDate: moment(),
  };

  opcao: any[] = [
    { id: 0, valor: "Não" },
    { id: 1, valor: "Sim" },
  ];

  resetForm() {
    this.receita = {
      _id: null,
      categoria: "",
      conta: "",
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
        this.receitaService.buscarReceita(id).subscribe(
          (retorno) => {
            this.receita = retorno.receita;
            this.dtReceita = {
              startDate: moment(retorno.receita.data),
              endDate: moment(retorno.receita.data),
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

  manterReceita(form) {
    if (form.invalid) {
      return;
    }

    this.isLoading = true;

    this.receita.data = this.dtReceita.startDate.toDate();
    this.receita.data.setHours(0, 0, 0, 0);

    this.receitaService.manterReceita(this.receita, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["../lancamentos/receitas"]);
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
