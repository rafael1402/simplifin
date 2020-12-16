import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Receita, ReceitaFull, RepeticaoTipo } from "./receita-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/receita`;

@Injectable({ providedIn: "root" })
export class ReceitaService {
  constructor(private http: HttpClient, private router: Router) {}

  private lancamentos: ReceitaFull[] = [];
  private lancamentosAtualizadas = new Subject<{
    lancamentos: ReceitaFull[];
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

  getReceitasListener() {
    return this.lancamentosAtualizadas.asObservable();
  }

  criarReceita(receita: Receita) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, receita);
  }

  listarReceitas(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    this.http
      .get<{
        mensagem: string;
        status: string;
        receitas: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .subscribe((data) => {
        this.lancamentos = data.receitas;
        this.lancamentosAtualizadas.next({
          lancamentos: [...this.lancamentos],
          count: data.maxItens,
        });
      });
  }

  buscarReceita(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      receita: Receita;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarReceita(receita: Receita) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      receita: Receita;
    }>(`${BACKEND_URL}/${receita._id}`, receita);
  }

  manterReceita(receita: Receita, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        receita: Receita;
      }>(`${BACKEND_URL}/${receita._id}`, receita);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        receita: Receita;
      }>(BACKEND_URL, receita);
  }

  excluirReceita(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
