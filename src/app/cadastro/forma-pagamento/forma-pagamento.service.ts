import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FormaPagamento } from "./forma-pagamento-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/forma-pagamento`;

@Injectable({ providedIn: "root" })
export class FormaPagamentoService {
  constructor(private http: HttpClient, private router: Router) {}

  private formasPagamento: FormaPagamento[] = [];
  private formasPagamentoAtualizadas = new Subject<{
    formasPagamento: FormaPagamento[];
    count: number;
  }>();

  getFormasPagamentoListener() {
    return this.formasPagamentoAtualizadas.asObservable();
  }

  criarFormaPagamento(formaPagamento: FormaPagamento) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, formaPagamento);
  }

  /*a função map antes do subscrive é usada para tratar o retorno do get antes de enviar o subscribe
  que nesse caso foi usado para tratrar o ID, que no backend é _id e no front é id*/
  listarFormasPagamento(intesPerpage: number, currentPage: number) {
    var queryParams = "";
    /*Se intesPerpage for 0, seginifa que a pagina será feita no frontend
    e por esse motivo o queryParams não será enviado*/
    if (intesPerpage > 0) {
      queryParams = `?pagesize=${intesPerpage}&page=${currentPage}`;
    }
    this.http
      .get<{
        mensagem: string;
        status: string;
        formasPagamento: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            formasPagamento: data.formasPagamento.map((formaPagamento) => {
              return {
                tipo: formaPagamento.tipo,
                descricao: formaPagamento.descricao,
                status: formaPagamento.status,
                id: formaPagamento._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
      .subscribe((data) => {
        this.formasPagamento = data.formasPagamento.sort(function (a, b) {
          if (a.descricao.toUpperCase() < b.descricao.toUpperCase()) {
            return -1;
          }
          if (a.descricao.toUpperCase() > b.descricao.toUpperCase()) {
            return 1;
          }
          return 0;
        });
        this.formasPagamentoAtualizadas.next({
          formasPagamento: [...this.formasPagamento],
          count: data.maxItens,
        });
      });
  }

  listarFormasPagamentoSelect() {
    var queryParams = `?status=1`;

    return this.http
      .get<{
        mensagem: string;
        status: string;
        formasPagamento: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            formasPagamento: data.formasPagamento.map((formaPagamento) => {
              return {
                tipo: formaPagamento.tipo,
                descricao: formaPagamento.descricao,
                status: formaPagamento.status,
                id: formaPagamento._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
  }


  buscarFormaPagamento(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      formaPagamento: FormaPagamento;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarFormaPagamento(formaPagamento: FormaPagamento) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      formaPagamento: FormaPagamento;
    }>(`${BACKEND_URL}/${formaPagamento.id}`, formaPagamento);
  }

  manterFormaPagamento(formaPagamento: FormaPagamento, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        formaPagamento: FormaPagamento;
      }>(`${BACKEND_URL}/${formaPagamento.id}`, formaPagamento);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        formaPagamento: FormaPagamento;
      }>(BACKEND_URL, formaPagamento);
  }

  excluirFormaPagamento(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
