import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { ResumoConta } from "./home-model";

const BACKEND_URL = `${environment.apiUrl}/relatorios`;

@Injectable({ providedIn: "root" })
export class HomeService {
  constructor(private http: HttpClient, private router: Router) {}

  private despesasPorCategoria = new Subject<{
    data: number[];
    label: string[];
    color: string[];
  }>();

  private despesasPorFormaPagamento = new Subject<{
    data: number[];
    label: string[];
    color: string[];
  }>();

  private receitasPorCategoria = new Subject<{
    data: number[];
    label: string[];
    color: string[];
  }>();

  private balancoContas = new Subject<{
    data: ResumoConta[];
  }>();

  private topDespesas = new Subject<{
    data: number[];
    label: string[];
    color: string[];
  }>();

  private topReceitas = new Subject<{
    data: number[];
    label: string[];
    color: string[];
  }>();

  private balancoMensal = new Subject<{
    data: number[];
    label: string[];
    color: string[];
  }>();

  getDespesasPorCategoriaListener() {
    return this.despesasPorCategoria.asObservable();
  }

  getReceitasPorCategoriaListener() {
    return this.receitasPorCategoria.asObservable();
  }

  getTopDespesasListener() {
    return this.topDespesas.asObservable();
  }

  getTopReceitasListener() {
    return this.topReceitas.asObservable();
  }

  getDespesasPorFormaPagamentoListener() {
    return this.despesasPorFormaPagamento.asObservable();
  }

  getBalancoMensalListener() {
    return this.balancoMensal.asObservable();
  }

  getBalancoContasListener() {
    return this.balancoContas.asObservable();
  }

  listarDespesasPorCategoria(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    this.http
      .get<{
        mensagem: string;
        status: string;
        retorno: { data: any; label: any; color: any };
      }>(`${BACKEND_URL}/despesa-por-categoria${queryParams}`)
      .subscribe((data) => {
        this.despesasPorCategoria.next({
          data: [...data.retorno.data],
          label: [...data.retorno.label],
          color: [...data.retorno.color],
        });
      });
  }

  listarDespesasPorFormaPagamento(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    this.http
      .get<{
        mensagem: string;
        status: string;
        retorno: { data: any; label: any; color: any };
      }>(`${BACKEND_URL}/despesa-por-forma-pagamento${queryParams}`)
      .subscribe((data) => {
        this.despesasPorFormaPagamento.next({
          data: [...data.retorno.data],
          label: [...data.retorno.label],
          color: [...data.retorno.color],
        });
      });
  }

  listarReceitasPorCategoria(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    this.http
      .get<{
        mensagem: string;
        status: string;
        retorno: { data: any; label: any; color: any };
      }>(`${BACKEND_URL}/receita-por-categoria${queryParams}`)
      .subscribe((data) => {
        this.receitasPorCategoria.next({
          data: [...data.retorno.data],
          label: [...data.retorno.label],
          color: [...data.retorno.color],
        });
      });
  }

  listarBalancoContas(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    this.http
      .get<{
        mensagem: string;
        status: string;
        retorno: ResumoConta[];
      }>(`${BACKEND_URL}/balanco-contas${queryParams}`)
      .subscribe((data) => {
        this.balancoContas.next({
          data: [...data.retorno],
        });
      });
  }

  listarTopDespesas(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }
    this.http
      .get<{
        mensagem: string;
        status: string;
        retorno: any;
      }>(`${BACKEND_URL}/top-despesas${queryParams}`)
      .subscribe((data) => {
        this.topDespesas.next({
          data: [...data.retorno.data],
          label: [...data.retorno.label],
          color: [...data.retorno.color],
        });
      });
  }

  listarTopReceitas(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }
    this.http
      .get<{
        mensagem: string;
        status: string;
        retorno: any;
      }>(`${BACKEND_URL}/top-receitas${queryParams}`)
      .subscribe((data) => {
        this.topReceitas.next({
          data: [...data.retorno.data],
          label: [...data.retorno.label],
          color: [...data.retorno.color],
        });
      });
  }

  listarBalancoMensal(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }
    this.http
      .get<{
        mensagem: string;
        status: string;
        retorno: any;
      }>(`${BACKEND_URL}/balanco-mensal${queryParams}`)
      .subscribe((data) => {
        this.balancoMensal.next({
          data: [...data.retorno.data],
          label: [...data.retorno.label],
          color: [...data.retorno.color],
        });
      });
  }
}
