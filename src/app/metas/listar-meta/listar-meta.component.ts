import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Meta, MetaItem } from "../meta-model";
import { MetaService } from "../meta.service";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { Categoria } from "../../cadastro/categoria/categoria-model";

@Component({
  templateUrl: "./listar-meta.component.html",
  styleUrls: ["./listar-meta.component.css"],
})
export class ListarMetaComponent implements OnInit, OnDestroy {
  constructor(private metaService: MetaService, private datePipe: DatePipe) {}

  /*Variaveis de tela*/
  isLoading = false;
  sortType: string;
  sortReverse: boolean = false;
  totalItens = 0;
  itensPerSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  nomeTela: string = "Metas de enconomia";

  dtFiltro: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment().startOf("month"),
    endDate: moment().endOf("month"),
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

  headerTable: Array<any> = [
    {
      nome: "Descrição ",
      value: "descricao",
      coluna: "A1",
      show: true,
      mobile: true,
    },
    {
      nome: "Período de",
      value: "dataInicio",
      coluna: "B1",
      show: true,
      mobile: true,
    },
    {
      nome: "Período até",
      value: "dataFim",
      coluna: "C1",
      show: true,
      mobile: true,
    },
  ];

  /*Variaveis  de negocio*/
  metas: Meta[] = [];
  metasFiltrados: Meta[] = [];
  metasPaginados: Meta[] = [];

  private metaSubs: Subscription;

  getHeader() {
    return this.headerTable.filter((x) => x.show === true);
  }

  sortTable(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.metasPaginados.sort(this.dynamicSort(property));
  }

  dynamicSort(property) {
    let sortOrder = -1;

    if (this.sortReverse) sortOrder = 1;

    return function (a, b) {
      let result;

      if (typeof a[property] === "object" && !Array.isArray(a[property])) {
        result =
          a[property].descricao.toString().toLowerCase() <
          b[property].descricao.toString().toLowerCase()
            ? -1
            : a[property].descricao.toString().toLowerCase() >
              b[property].descricao.toString().toLowerCase()
            ? 1
            : 0;
      } else {
        result =
          a[property].toString().toLowerCase() <
          b[property].toString().toLowerCase()
            ? -1
            : a[property].toString().toLowerCase() >
              b[property].toString().toLowerCase()
            ? 1
            : 0;
      }
      return result * sortOrder;
    };
  }

  /*Quando a paginação for frontside*/
  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.metasPaginados = pageOfItems;
  }

  filter(search: string) {
    this.metasFiltrados = this.metas.filter((o) =>
      Object.keys(o).some((k) => {
        if (typeof o[k] === "object" && o[k] != null && !Array.isArray(o[k]))
          return o[k].descricao.toLowerCase().includes(search.toLowerCase());
        if (typeof o[k] === "string" && k != "id")
          return o[k].toLowerCase().includes(search.toLowerCase());
        //return o[k].descricao.toLowerCase().includes(search.toLowerCase());
      })
    );
  }

  listaItens() {
    this.isLoading = true;
    this.metaService.listarMetas();

    this.metaSubs = this.metaService.getMetasListener().subscribe(
      (metasRet: { metas: Meta[]; count: number }) => {
        this.metas = metasRet.metas;
        this.totalItens = metasRet.count;
        this.metasFiltrados = this.metas;
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
  }

  ngOnInit() {
    this.listaItens();
  }

  deleteItem(item: Meta) {
    Swal.fire({
      title: "Confirma exclusão ?",
      text: "Essa ação não pode ser revertida",
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: "Cancelar",
      confirmButtonText: "Excluir",
    }).then((result) => {
      if (result.isConfirmed) {
        this.isLoading = true;
        this.metaService.excluirMeta(item).subscribe(
          (retorno) => {
            this.Toast.fire({
              text: retorno.mensagem,
              icon: retorno.status === "OK" ? "success" : "error",
            });

            if (retorno.status === "OK") {
              this.listaItens();
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
    });
  }

  ngOnDestroy() {
    this.metaSubs.unsubscribe();
  }
}
