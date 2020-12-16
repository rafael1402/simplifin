import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Categoria, OpcaoCategoria } from "./categoria-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/categoria`;

@Injectable({ providedIn: "root" })
export class CategoriaService {
  constructor(private http: HttpClient, private router: Router) {}

  private categorias: Categoria[] = [];
  private categoriasAtualizadas = new Subject<{
    categorias: Categoria[];
    count: number;
  }>();

  private opcaoCategoria: OpcaoCategoria[] = [
    { tipo: "R", descricao: "Receita" },
    { tipo: "D", descricao: "Despesa" },
  ];


  getOpcaoCategoria() {
    return this.opcaoCategoria;
  }

  getCategoriasListener() {
    return this.categoriasAtualizadas.asObservable();
  }

  criarCategoria(categoria: Categoria) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, categoria);
  }

  /*a função map antes do subscrive é usada para tratar o retorno do get antes de enviar o subscribe
  que nesse caso foi usado para tratrar o ID, que no backend é _id e no front é id*/
  listarCategorias(intesPerpage: number, currentPage: number) {
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
        categorias: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            categorias: data.categorias.map((categoria) => {
              return {
                tipo: categoria.tipo,
                descricao: categoria.descricao,
                status: categoria.status,
                id: categoria._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
      .subscribe((data) => {
        this.categorias = data.categorias.sort(function (a, b) {
          if (a.descricao.toUpperCase() < b.descricao.toUpperCase()) {
            return -1;
          }
          if (a.descricao.toUpperCase() > b.descricao.toUpperCase()) {
            return 1;
          }
          return 0;
        });
        this.categoriasAtualizadas.next({
          categorias: [...this.categorias],
          count: data.maxItens,
        });
      });
  }

  listarCategoriasSelect(tipo: string) {
    var queryParams = "";
    /*Se intesPerpage for 0, seginifa que a pagina será feita no frontend
    e por esse motivo o queryParams não será enviado*/
    if (tipo) {
      queryParams = `?tipo=${tipo}&status=1`;
    }
    return this.http
      .get<{
        mensagem: string;
        status: string;
        categorias: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            categorias: data.categorias.map((categoria) => {
              return {
                tipo: categoria.tipo,
                descricao: categoria.descricao,
                status: categoria.status,
                id: categoria._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
  }

  buscarCategoria(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      categoria: Categoria;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarCategoria(categoria: Categoria) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      categoria: Categoria;
    }>(`${BACKEND_URL}/${categoria.id}`, categoria);
  }

  manterCategoria(categoria: Categoria, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        categoria: Categoria;
      }>(`${BACKEND_URL}/${categoria.id}`, categoria);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        categoria: Categoria;
      }>(BACKEND_URL, categoria);
  }

  excluirCategoria(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
