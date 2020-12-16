import { Component, OnDestroy, OnInit } from "@angular/core";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Categoria } from "../../cadastro/categoria/categoria-model";
import { CategoriaService } from "../../cadastro/categoria/categoria.service";
import { Meta, MetaItem } from "../meta-model";
import { MetaService } from "../meta.service";

import * as moment from "moment";
//import * as localization from 'moment/locale/pt-br';
moment.locale("pt-br");

@Component({
  templateUrl: "./nova-meta.component.html",
})
export class NovaMetaComponent implements OnInit {
  constructor(
    private metaService: MetaService,
    private categoriaService: CategoriaService,
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

  categorias: Categoria[];

  meta: Meta;
  metaItens: MetaItem[] = [];
  metaItem: MetaItem = {
    _id: null,
    categoria: "",
    valor: null,
  };

  dtMeta: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment().startOf("month"),
    endDate: moment().endOf("month"),
  };

  resetForm() {
    this.meta = {
      _id: null,
      descricao: "",
      dataInicio: moment().startOf("month").toDate(),
      dataFim: moment().endOf("month").toDate(),
      metaItens: [],
    };

    this.dtMeta = {
      startDate: moment().startOf("month"),
      endDate: moment().endOf("month"),
    };
  }

  ngOnInit() {
    this.resetForm();

    this.categoriaService.listarCategoriasSelect("D").subscribe((ret) => {
      this.categorias = ret.categorias;
    });

    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        this.edit = true;
        let id = paramMap.get("id");
        this.isLoading = true;
        this.metaService.buscarMeta(id).subscribe(
          (retorno) => {
            this.meta = retorno.meta;
            this.dtMeta = {
              startDate: moment(retorno.meta.dataInicio),
              endDate: moment(retorno.meta.dataFim),
            };
            this.metaItens = retorno.metaItens;
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

  removerItem(item: MetaItem) {
    this.metaItens = this.metaItens.filter(function (element) {
      return element != item;
    });
  }

  adicionaItem() {
    this.metaItens.push({ ...this.metaItem });

    this.metaItem = {
      _id: null,
      categoria: "",
      valor: null,
    };
  }

  manterMeta(form) {
    if (form.invalid) {
      return;
    }

    this.meta.metaItens = this.metaItens;

    this.isLoading = true;

    this.meta.dataInicio = this.dtMeta.startDate.toDate();
    this.meta.dataInicio.setHours(0, 0, 0, 0);

    this.meta.dataFim = this.dtMeta.endDate.toDate();
    this.meta.dataFim.setHours(0, 0, 0, 0);

    this.metaService.manterMeta(this.meta, this.edit).subscribe(
      (retorno) => {
        this.isLoading = false;

        this.Toast.fire({
          text: retorno.mensagem,
          icon: retorno.status === "OK" ? "success" : "error",
        });

        if (retorno.status === "OK") {
          this.router.navigate(["../meta/metas"]);
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
