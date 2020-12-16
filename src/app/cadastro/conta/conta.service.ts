import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Conta, OpcaoConta } from "./conta-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/conta`;

@Injectable({ providedIn: "root" })
export class ContaService {
  constructor(private http: HttpClient, private router: Router) {}

  private  opcaoConta: OpcaoConta[] = [
    { tipo: "C", descricao: "Corrente" },
    { tipo: "P", descricao: "Poupança" },
    { tipo: "I", descricao: "Investimento" },
  ];

  private contas: Conta[] = [];
  private contasAtualizadas = new Subject<{
    contas: Conta[];
    count: number;
  }>();

  getOpcaoConta(){
    return this.opcaoConta;
  }

  getContasListener() {
    return this.contasAtualizadas.asObservable();
  }

  criarConta(conta: Conta) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, conta);
  }

  /*a função map antes do subscrive é usada para tratar o retorno do get antes de enviar o subscribe
  que nesse caso foi usado para tratrar o ID, que no backend é _id e no front é id*/
  listarContas(intesPerpage: number, currentPage: number) {
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
        contas: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            contas: data.contas.map((conta) => {
              return {
                tipo: conta.tipo,
                descricao: conta.descricao,
                status: conta.status,
                id: conta._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
      .subscribe((data) => {
        this.contas = data.contas.sort(function (a, b) {
          if (a.descricao.toUpperCase() < b.descricao.toUpperCase()) {
            return -1;
          }
          if (a.descricao.toUpperCase() > b.descricao.toUpperCase()) {
            return 1;
          }
          return 0;
        });
        this.contasAtualizadas.next({
          contas: [...this.contas],
          count: data.maxItens,
        });
      });
  }

  listarContasSelect() {
    var queryParams = `?status=1`;

    return this.http
      .get<{
        mensagem: string;
        status: string;
        contas: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            contas: data.contas.map((conta) => {
              return {
                tipo: conta.tipo,
                descricao: conta.descricao,
                status: conta.status,
                id: conta._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
  }

  buscarConta(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      conta: Conta;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarConta(conta: Conta) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      conta: Conta;
    }>(`${BACKEND_URL}/${conta.id}`, conta);
  }

  manterConta(conta: Conta, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        conta: Conta;
      }>(`${BACKEND_URL}/${conta.id}`, conta);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        conta: Conta;
      }>(BACKEND_URL, conta);
  }

  excluirConta(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
