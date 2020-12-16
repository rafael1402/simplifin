import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import Swal from "sweetalert2";
import { Despesa, DespesaFull, DespesaSheet } from "../despesa-model";
import { DespesaService } from "../despesa.service";
import * as xlsx from "xlsx";
import { DatePipe } from "@angular/common";
import * as moment from "moment";
//import "chart.piecelabel.js";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { ChartOptions } from "chart.js";

@Component({
  templateUrl: "./listar-despesa.component.html",
  styleUrls: ["./listar-despesa.component.css"],
})
export class ListarDespesaComponent implements OnDestroy {
  constructor(
    private despesaService: DespesaService,
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
  nomeTela: string = "Despesas";
  total: number = 0;
  totalAberto: number = 0;
  totalCentros: number = 0;
  totalPorCentroData: Array<number> = [];
  totalPorCentroLabel: Array<string> = [];

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

  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: 'auto',
        color: 'white',
        font: {
          size: 12,
          //weight: 'bold'
        },
        textStrokeColor: 'black',
        textStrokeWidth: 3,
        formatter: function (value, context) {
          return "R$" + value;
        },
      },
    },
  };

  public barChartPlugins = [pluginDataLabels];

  headerTable: Array<any> = [
    {
      nome: "Data",
      value: "data",
      coluna: "A1",
      show: true,
      mobile: true,
    },
    {
      nome: "Conta",
      value: "conta",
      coluna: "B1",
      show: true,
      mobile: false,
    },
    {
      nome: "Nº Documento",
      value: "documento",
      coluna: "C1",
      show: true,
      mobile: false,
    },
    {
      nome: "Descrição",
      value: "descricao",
      coluna: "D1",
      show: true,
      mobile: false,
    },
    {
      nome: "Forma Pgto",
      value: "formaPagamento",
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
      nome: "Pago",
      value: "baixado",
      coluna: "G1",
      show: true,
      mobile: false,
    },
    {
      nome: "Categoria",
      value: "categoria",
      coluna: "H1",
      show: true,
      mobile: false,
    },
    {
      nome: "Observação",
      value: "observacao",
      coluna: "I1",
      show: false,
      mobile: false,
    },
    {
      nome: "Dividido com",
      value: "centro",
      coluna: "J1",
      show: true,
      mobile: false,
    },
    {
      nome: "Percentual Divisão",
      value: "percentualRateio",
      coluna: "K1",
      show: false,
      mobile: false,
    },
    {
      nome: "Valor Divisão",
      value: "valorRateio",
      coluna: "L1",
      show: false,
      mobile: false,
    },
    {
      nome: "Tags",
      value: "tag",
      coluna: "M1",
      show: true,
      mobile: false,
    },
  ];

  /*Variaveis  de negocio*/
  lancamentos: DespesaFull[] = [];
  lancamentosFiltrados: DespesaFull[] = [];
  lancamentosPaginados: DespesaFull[] = [];

  private despesaSubs: Subscription;

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
    this.despesaService.listarDespesas(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );
    this.despesaSubs = this.despesaService
      .getDespesasListener()
      .subscribe(
        (lancamentosRet: { lancamentos: DespesaFull[]; count: number }) => {
          this.lancamentos = lancamentosRet.lancamentos;
          this.totalItens = lancamentosRet.count;
          this.lancamentosFiltrados = this.lancamentos;
          this.isLoading = false;
          /*reduce é utilizado para somar valores de um array*/
          this.total = this.lancamentos.reduce((total, item) => {
            return total + item.valor;
          }, 0);
          this.totalAberto = this.lancamentos.reduce((total, item) => {
            return total + (item.baixado == 1 ? 0 : item.valor);
          }, 0);

          this.total = Math.round((this.total + Number.EPSILON) * 100) / 100;
          this.totalAberto =
            Math.round((this.totalAberto + Number.EPSILON) * 100) / 100;

          /*Funão para pegar o distinct de dos centros*/
          const centros: string[] = [
            ...new Set(this.lancamentos.map((x) => x.centro?.descricao)),
          ];

          this.totalCentros = 0;
          this.totalPorCentroData = [];
          this.totalPorCentroLabel = [];

          centros.forEach((centro) => {
            if (centro != null) {
              let valor = this.lancamentos.reduce((total, item) => {
                return (
                  total +
                  (item.centro?.descricao == centro ? item.valorRateio : 0)
                );
              }, 0);

              valor = Math.round((valor + Number.EPSILON) * 100) / 100;

              this.totalCentros += valor;

              this.totalPorCentroLabel.push(centro);
              this.totalPorCentroData.push(valor);
            }
          });

          let valorFinal =
            Math.round(
              (this.total - this.totalCentros + Number.EPSILON) * 100
            ) / 100;

          this.totalPorCentroLabel.push(`Você`);
          this.totalPorCentroData.push(valorFinal);
        }
      );
  }

  AtualizaItens() {
    this.listaItens();
  }

  baixarItem(item: Despesa) {
    this.isLoading = true;
    item.baixado = item.baixado == 1 ? 0 : 1;
    this.despesaService.atualizarDespesa(item).subscribe(
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

  deleteItem(item: Despesa) {
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
        this.despesaService.excluirDespesa(item._id).subscribe(
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
    let despesaSheet: DespesaSheet[] = [];

    this.lancamentos.forEach((element) => {
      despesaSheet.push({
        data: this.datePipe.transform(element.data, "dd/MM/yyy"),
        conta: element.conta.descricao,
        documento: element.documento,
        descricao: element.descricao,
        formaPagamento: element.formaPagamento.descricao,
        valor: element.valor,
        baixado: element.baixado == 0 ? "Sim" : "Não",
        categoria: element.categoria.descricao,
        observacao: element.observacao,
        centro: element.centro?.descricao,
        percentualRateio: element.percentualRateio,
        valorRateio: element.valorRateio,
        tag: element.tag
          .map(function (elem) {
            return elem.descricao;
          })
          .join(),
      });
    });

    const ws: xlsx.WorkSheet = xlsx.utils.json_to_sheet(despesaSheet);
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
    this.despesaSubs.unsubscribe();
  }
}
