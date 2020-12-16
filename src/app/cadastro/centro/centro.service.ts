import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Centro } from "./centro-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/centro`;

@Injectable({ providedIn: "root" })
export class CentroService {
  constructor(private http: HttpClient, private router: Router) {}

  private centros: Centro[] = [];
  private centrosAtualizadas = new Subject<{
    centros: Centro[];
    count: number;
  }>();

  getCentrosListener() {
    return this.centrosAtualizadas.asObservable();
  }

  criarCentro(centro: Centro) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, centro);
  }

  /*a função map antes do subscrive é usada para tratar o retorno do get antes de enviar o subscribe
  que nesse caso foi usado para tratrar o ID, que no backend é _id e no front é id*/
  listarCentros(intesPerpage: number, currentPage: number) {
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
        centros: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            centros: data.centros.map((centro) => {
              return {
                tipo: centro.tipo,
                descricao: centro.descricao,
                status: centro.status,
                id: centro._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
      .subscribe((data) => {
        this.centros = data.centros.sort(function (a, b) {
          if (a.descricao.toUpperCase() < b.descricao.toUpperCase()) {
            return -1;
          }
          if (a.descricao.toUpperCase() > b.descricao.toUpperCase()) {
            return 1;
          }
          return 0;
        });
        this.centrosAtualizadas.next({
          centros: [...this.centros],
          count: data.maxItens,
        });
      });
  }

  listarCentrosSelect() {
    var queryParams = `?status=1`;

    return this.http
      .get<{
        mensagem: string;
        status: string;
        centros: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            centros: data.centros.map((centro) => {
              return {
                tipo: centro.tipo,
                descricao: centro.descricao,
                status: centro.status,
                id: centro._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
  }

  buscarCentro(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      centro: Centro;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarCentro(centro: Centro) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      centro: Centro;
    }>(`${BACKEND_URL}/${centro.id}`, centro);
  }

  manterCentro(centro: Centro, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        centro: Centro;
      }>(`${BACKEND_URL}/${centro.id}`, centro);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        centro: Centro;
      }>(BACKEND_URL, centro);
  }

  excluirCentro(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
