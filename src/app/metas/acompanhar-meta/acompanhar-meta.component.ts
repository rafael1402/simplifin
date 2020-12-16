import { Component, OnDestroy, OnInit } from "@angular/core";
import { ParamMap, ActivatedRoute, Router } from "@angular/router";
import Swal from "sweetalert2";
import { Categoria } from "../../cadastro/categoria/categoria-model";
import { CategoriaService } from "../../cadastro/categoria/categoria.service";
import { Meta, MetaAcompanhamento, MetaItem } from "../meta-model";
import { MetaService } from "../meta.service";

@Component({
  templateUrl: "./acompanhar-meta.component.html",
  styleUrls: ["./acompanhar-meta.component.css"],
})
export class AcompanharMetaComponent implements OnInit {
  constructor(
    private metaService: MetaService,
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
  sortType: string;
  sortReverse: boolean = false;

  meta: Meta;
  metaAcompanhamento: MetaAcompanhamento[] = [];

  headerTable: Array<any> = [
    {
      nome: "Categoria ",
      value: "descricao",
      coluna: "A1",
      show: true,
      mobile: true,
    },
    {
      nome: "Valor Meta",
      value: "valor",
      coluna: "B1",
      show: true,
      mobile: false,
    },
    {
      nome: "Total Despesa",
      value: "totalDespesa",
      coluna: "C1",
      show: true,
      mobile: false,
    },
    {
      nome: "Acompanhamento",
      value: "percentualMeta",
      coluna: "D1",
      show: true,
      mobile: true,
    },
  ];

  getHeader() {
    return this.headerTable.filter((x) => x.show === true);
  }

  sortTable(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.metaAcompanhamento.sort(this.dynamicSort(property));
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

  ngOnInit() {
    this.activeRouter.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("id")) {
        let id = paramMap.get("id");
        this.isLoading = true;
        this.metaService.acompanharMeta(id).subscribe(
          (retorno) => {
            this.meta = retorno.meta;
            this.metaAcompanhamento = retorno.metaAcompanhamento;
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
    });
  }
}
