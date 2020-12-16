import { Component, OnDestroy, OnInit } from "@angular/core";
import { HomeService } from "./home.service";
import * as moment from "moment";
import { Subscription } from "rxjs";
import { ResumoConta } from "./home-model";
import * as pluginDataLabels from "chartjs-plugin-datalabels";
import { ChartOptions } from "chart.js";

@Component({
  templateUrl: "home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit, OnDestroy {
  constructor(private homeService: HomeService) {}

  private despesasPorCategoriaSub: Subscription;
  private receitasPorCategoriaSub: Subscription;
  private despesasPorFormaPagamentoSub: Subscription;
  private topReceitasSub: Subscription;
  private topDespesasSub: Subscription;
  private BalancoContasSub: Subscription;
  private BalancoMensalSub: Subscription;

  isLoadingDespesasPorCategoria = false;
  isLoadingReceitasPorCategoria = false;
  isLoadingTopDespesas = false;
  isLoadingTopReceitas = false;
  isLoadingDespesasPorFormaPagamento = false;
  isLoadingResumoConta = false;
  isLoadingBalancoMensal = false;

  vazioMsg: string = "Nenhum registro encontrado!";

  public chartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      datalabels: {
        display: true,
        color: "white",
        font: {
          size: 12,
          //weight: 'bold'
        },
        textStrokeColor: "black",
        textStrokeWidth: 3,
        formatter: function (value, context) {
          return "R$" + value;
        },
      },
    },
  };

  public barChartPlugins = [pluginDataLabels];

  despesasPorCategoriaData: Array<number> = [];
  despesasPorCategoriaLabel: Array<string> = [];
  despesasPorCategoriaColors: Array<any> = [];

  receitasPorCategoriaData: Array<number> = [];
  receitasPorCategoriaLabel: Array<string> = [];
  receitasPorCategoriaColors: Array<any> = [];

  topDespesasData: Array<number> = [];
  topDespesasLabel: Array<string> = [];
  topDespesasColors: Array<any> = [];

  topReceitasData: Array<number> = [];
  topReceitasLabel: Array<string> = [];
  topReceitasColors: Array<any> = [];

  despesasPorFormaPagamentoData: Array<number> = [];
  despesasPorFormaPagamentoLabel: Array<string> = [];
  despesasPorFormaPagamentoColors: Array<any> = [];

  resumoConta: ResumoConta[];

  somaTotalReceitas: number;
  somaTotalDespesas: number;
  somaTotalTransferenciasEntradas: number;
  somaTotalRransferenciasSaidas: number;
  somaSaldo: number;

  balancoMensalData: Array<number> = [];
  balancoMensalLabel: Array<string> = [];
  balancoMensalColors: Array<any> = [];

  //barChartPlugins = [pluginDataLabels];

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

  /*
  chartOptions: any = {
    pieceLabel: {
      render: function (args) {
        const value = args.value;
        return `R$${value}`;
      },
      fontStyle: "bold",
      position: "outside",
    },
  };*/

  ngOnInit(): void {}

  carregarRelatorios(): void {
    this.listarDespesasPorCategoria();
    this.listarReceitasPorCategoria();
    this.listarDespesasPorFormaPagamento();
    this.listarBalancoContas();
    this.listarTopDespesas();
    this.listarTopReceitas();
    this.listarBalancoMensal();
  }

  listarTopDespesas() {
    this.isLoadingTopDespesas = true;
    this.homeService.listarTopDespesas(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );

    this.topDespesasSub = this.homeService.getTopDespesasListener().subscribe(
      (retorno) => {
        this.isLoadingTopDespesas = false;
        this.topDespesasData = retorno.data;
        this.topDespesasLabel = retorno.label;
        this.topDespesasColors = retorno.color;
      },
      (err) => {
        console.log(err);
        this.isLoadingTopDespesas = false;
      }
    );
  }

  listarTopReceitas() {
    this.isLoadingTopReceitas = true;
    this.homeService.listarTopReceitas(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );

    this.topReceitasSub = this.homeService.getTopReceitasListener().subscribe(
      (retorno) => {
        this.isLoadingTopReceitas = false;
        this.topReceitasData = retorno.data;
        this.topReceitasLabel = retorno.label;
        this.topReceitasColors = retorno.color;
      },
      (err) => {
        this.isLoadingTopReceitas = false;
        console.log(err);
      }
    );
  }

  listarBalancoContas() {
    this.isLoadingResumoConta = true;
    this.homeService.listarBalancoContas(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );

    this.BalancoContasSub = this.homeService
      .getBalancoContasListener()
      .subscribe(
        (retorno) => {
          this.somaTotalReceitas = 0;
          this.somaTotalDespesas = 0;
          this.somaTotalTransferenciasEntradas = 0;
          this.somaTotalRransferenciasSaidas = 0;
          this.somaSaldo = 0;

          this.isLoadingResumoConta = false;
          this.resumoConta = retorno.data;

          this.somaTotalDespesas = this.resumoConta.reduce((total, item) => {
            return total + item.totalDespesas;
          }, 0);

          this.somaTotalReceitas = this.resumoConta.reduce((total, item) => {
            return total + item.totalReceitas;
          }, 0);

          this.somaTotalRransferenciasSaidas = this.resumoConta.reduce(
            (total, item) => {
              return total + item.totalTransferenciasSaidas;
            },
            0
          );

          this.somaTotalTransferenciasEntradas = this.resumoConta.reduce(
            (total, item) => {
              return total + item.totalTransferenciasEntradas;
            },
            0
          );

          this.somaSaldo = this.resumoConta.reduce((total, item) => {
            return total + item.saldo;
          }, 0);
        },
        (err) => {
          this.isLoadingResumoConta = false;
          console.log(err);
        }
      );
  }

  listarBalancoMensal() {
    this.isLoadingBalancoMensal = true;
    this.homeService.listarBalancoMensal(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );

    this.BalancoMensalSub = this.homeService
      .getBalancoMensalListener()
      .subscribe(
        (retorno) => {
          this.isLoadingBalancoMensal = false;
          this.balancoMensalData = retorno.data;
          this.balancoMensalLabel = retorno.label;
          this.balancoMensalColors = retorno.color;
        },
        (err) => {
          this.isLoadingBalancoMensal = false;
          console.log(err);
        }
      );
  }

  listarDespesasPorCategoria() {
    this.isLoadingDespesasPorCategoria = true;
    this.homeService.listarDespesasPorCategoria(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );

    this.despesasPorCategoriaSub = this.homeService
      .getDespesasPorCategoriaListener()
      .subscribe(
        (retorno) => {
          this.isLoadingDespesasPorCategoria = false;
          this.despesasPorCategoriaData = retorno.data;
          this.despesasPorCategoriaLabel = retorno.label;
          this.despesasPorCategoriaColors = retorno.color;
        },
        (err) => {
          this.isLoadingDespesasPorCategoria = false;
          console.log(err);
        }
      );
  }

  listarDespesasPorFormaPagamento() {
    this.isLoadingDespesasPorFormaPagamento = true;
    this.homeService.listarDespesasPorFormaPagamento(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );

    this.despesasPorCategoriaSub = this.homeService
      .getDespesasPorFormaPagamentoListener()
      .subscribe(
        (retorno) => {
          this.isLoadingDespesasPorFormaPagamento = false;
          this.despesasPorFormaPagamentoData = retorno.data;
          this.despesasPorFormaPagamentoLabel = retorno.label;
          this.despesasPorFormaPagamentoColors = retorno.color;
        },
        (err) => {
          this.isLoadingDespesasPorFormaPagamento = false;
          console.log(err);
        }
      );
  }

  listarReceitasPorCategoria() {
    this.isLoadingReceitasPorCategoria = true;
    this.homeService.listarReceitasPorCategoria(
      this.dtFiltro.startDate.format("yyyy-MM-DD"),
      this.dtFiltro.endDate.format("yyyy-MM-DD")
    );

    this.receitasPorCategoriaSub = this.homeService
      .getReceitasPorCategoriaListener()
      .subscribe(
        (retorno) => {
          this.isLoadingReceitasPorCategoria = false;
          this.receitasPorCategoriaData = retorno.data;
          this.receitasPorCategoriaLabel = retorno.label;
          this.receitasPorCategoriaColors = retorno.color;
        },
        (err) => {
          this.isLoadingReceitasPorCategoria = false;
          console.log(err);
        }
      );
  }

  ngOnDestroy(): void {
    this.despesasPorCategoriaSub?.unsubscribe();
    this.receitasPorCategoriaSub?.unsubscribe();
    this.despesasPorFormaPagamentoSub?.unsubscribe();
    this.topReceitasSub?.unsubscribe();
    this.topDespesasSub?.unsubscribe();
    this.BalancoContasSub?.unsubscribe();
    this.BalancoMensalSub?.unsubscribe();
  }
}
