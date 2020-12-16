import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Despesa, DespesaFull, RepeticaoTipo } from "./despesa-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/despesa`;

@Injectable({ providedIn: "root" })
export class DespesaService {
  constructor(private http: HttpClient, private router: Router) {}

  private lancamentos: DespesaFull[] = [];
  private lancamentosAtualizadas = new Subject<{
    lancamentos: DespesaFull[];
    count: number;
  }>();

  private repeticaoTipo: RepeticaoTipo[] = [
    { tipo: "U", descricao: "Unico" },
    { tipo: "P", descricao: "Parcelado" },
    { tipo: "F", descricao: "Fixo" },
  ];

  getRepeticaoTipo() {
    return this.repeticaoTipo;
  }

  getDespesasListener() {
    return this.lancamentosAtualizadas.asObservable();
  }

  criarDespesa(despesa: Despesa) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, despesa);
  }

  listarDespesas(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    this.http
      .get<{
        mensagem: string;
        status: string;
        despesas: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .subscribe((data) => {
        this.lancamentos = data.despesas;
        this.lancamentosAtualizadas.next({
          lancamentos: [...this.lancamentos],
          count: data.maxItens,
        });
      });
  }

  buscarDespesa(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      despesa: Despesa;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarDespesa(despesa: Despesa) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      despesa: Despesa;
    }>(`${BACKEND_URL}/${despesa._id}`, despesa);
  }

  manterDespesa(despesa: Despesa, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        despesa: Despesa;
      }>(`${BACKEND_URL}/${despesa._id}`, despesa);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        despesa: Despesa;
      }>(BACKEND_URL, despesa);
  }

  excluirDespesa(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
