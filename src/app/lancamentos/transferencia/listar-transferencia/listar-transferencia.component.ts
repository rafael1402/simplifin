import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import {
  Transferencia,
  TransferenciaFull,
  TransferenciaSheet,
} from "../transferencia-model";
import { TransferenciaService } from "../transferencia.service";
import * as xlsx from "xlsx";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
import { type } from "os";
import { Centro } from "../../../cadastro/centro/centro-model";

@Component({
  templateUrl: "./listar-transferencia.component.html",
  styleUrls: ["./listar-transferencia.component.css"],
})
export class ListarTransferenciaComponent implements OnDestroy {
  constructor(
    private transferenciaService: TransferenciaService,
    private datePipe: DatePipe
  ) {}

  /*Variaveis de tela*/
  isLoading = false;
  sortType: string;
  sortReverse: boolean = false;
  totalItens = 0;
  itensPerSize = 5;
  currentPage = 1;
  pageSizeOptions = [5, 10, 25, 50, 100];
  nomeTela: string = "Transferências";
  total: number = 0;

  dtFiltro: { startDate: moment.Moment; endDate: moment.Moment } = {
    startDate: moment().startOf("month"),
    endDate: moment().endOf("month"),
  };

  ranges: any = {
    hoje: [moment(), moment()],
    Ontem: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Últimos 7 dias": [moment().subtract(6, "days"), moment()],
    "Últimos 30 dias": [moment().subtract(29, "days"), moment()],
    "Esse mês": [moment().startOf("month"), moment().endOf("month")],
    "Esse Ano": [moment().startOf("year"), moment().endOf("year")],
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
      nome: "Data",
      value: "data",
      coluna: "A1",
      show: true,
      mobile: true,
    },
    {
      nome: "Conta Origem",
      value: "contaOrigem",
      coluna: "B1",
      show: true,
      mobile: false,
    },
    {
      nome: "Conta Destino",
      value: "contaDestino",
      coluna: "C1",
      show: true,
      mobile: false,
    },
    {
      nome: "Nº Documento",
      value: "documento",
      coluna: "D1",
      show: true,
      mobile: false,
    },
    {
      nome: "Descrição",
      value: "descricao",
      coluna: "E1",
      show: true,
      mobile: false,
    },
    {
      nome: "Valor",
      value: "valor",
      coluna: "F1",
      show: true,
      mobile: true,
    },
    {
      nome: "Observação",
      value: "observacao",
      coluna: "G1",
      show: false,
      mobile: false,
    },
    {
      nome: "Tags",
      value: "tag",
      coluna: "H1",
      show: true,
      mobile: false,
    },
  ];

  /*Variaveis  de negocio*/
  lancamentos: TransferenciaFull[] = [];
  lancamentosFiltrados: TransferenciaFull[] = [];
  lancamentosPaginados: TransferenciaFull[] = [];

  private transferenciaSubs: Subscription;

  getHeader() {
    return this.headerTable.filter((x) => x.show === true);
  }

  sortTable(property) {
    this.sortType = property;
    this.sortReverse = !this.sortReverse;
    this.lancamentosPaginados.sort(this.dynamicSort(property));
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
    this.lancamentosPaginados = pageOfItems;
  }

  filter(search: string) {
    this.lancamentosFiltrados = this.lancamentos.filter((o) =>
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
    this.transferenciaService.listarTransferencias(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );
    this.transferenciaSubs = this.transferenciaService
      .getTransferenciasListener()
      .subscribe(
        (lancamentosRet: {
          lancamentos: TransferenciaFull[];
          count: number;
        }) => {
          this.lancamentos = lancamentosRet.lancamentos;
          this.totalItens = lancamentosRet.count;
          this.lancamentosFiltrados = this.lancamentos;
          this.isLoading = false;
          /*reduce é utilizado para somar valores de um array*/
          this.total = this.lancamentos.reduce((total, item) => {
            return total + item.valor;
          }, 0);

          this.total = Math.round((this.total + Number.EPSILON) * 100) / 100;
        }
      );
  }

  AtualizaItens() {
    this.listaItens();
  }

  baixarItem(item: Transferencia) {
    this.isLoading = true;
    this.transferenciaService.atualizarTransferencia(item).subscribe(
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

  deleteItem(item: Transferencia) {
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
        this.transferenciaService.excluirTransferencia(item._id).subscribe(
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

  exportToExcel() {
    let transferenciaSheet: TransferenciaSheet[] = [];

    this.lancamentos.forEach((element) => {
      transferenciaSheet.push({
        data: this.datePipe.transform(element.data, "dd/MM/yyy"),
        contaOrigem: element.contaOrigem.descricao,
        contaDestino: element.contaDestino.descricao,
        documento: element.documento,
        descricao: element.descricao,
        valor: element.valor,
        observacao: element.observacao,
        tag: element.tag
          .map(function (elem) {
            return elem.descricao;
          })
          .join(),
      });
    });

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(transferenciaSheet);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, this.nomeTela);
    let first_sheet_name = wb.SheetNames[0];
    let worksheet = wb.Sheets[first_sheet_name];

    this.headerTable.forEach((element) => {
      worksheet[element.coluna].v = element.nome;
    });

    xlsx.writeFile(wb, `${this.nomeTela}.xlsx`);
  }

  ngOnDestroy() {
    this.transferenciaSubs.unsubscribe();
  }
}
