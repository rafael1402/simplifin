import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Tag, TagCores } from "./tag-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/tag`;

@Injectable({ providedIn: "root" })
export class TagService {
  constructor(private http: HttpClient, private router: Router) {}

  private tags: Tag[] = [];
  private tagsAtualizadas = new Subject<{
    tags: Tag[];
    count: number;
  }>();

  private tagCores: TagCores[] = [
    { cor: "B40404", corTexto: "FFFFFF" },
    { cor: "B45F04", corTexto: "FFFFFF" },
    { cor: "D7DF01", corTexto: "000000" },
    { cor: "31B404", corTexto: "FFFFFF" },
    { cor: "088A85", corTexto: "FFFFFF" },
    { cor: "0B2161", corTexto: "FFFFFF" },
    { cor: "8A0886", corTexto: "FFFFFF" },
    { cor: "BDBDBD", corTexto: "000000" },
  ];

  getTagCores() {
    return this.tagCores;
  }

  getTagsListener() {
    return this.tagsAtualizadas.asObservable();
  }

  criarTag(tag: Tag) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, tag);
  }

  /*a função map antes do subscrive é usada para tratar o retorno do get antes de enviar o subscribe
  que nesse caso foi usado para tratrar o ID, que no backend é _id e no front é id*/
  listarTags(intesPerpage: number, currentPage: number) {
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
        tags: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            tags: data.tags.map((tag) => {
              return {
                descricao: tag.descricao,
                cor: tag.cor,
                corTexto: tag.corTexto,
                status: tag.status,
                id: tag._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      )
      .subscribe((data) => {
        this.tags = data.tags.sort(function (a, b) {
          if (a.descricao.toUpperCase() < b.descricao.toUpperCase()) {
            return -1;
          }
          if (a.descricao.toUpperCase() > b.descricao.toUpperCase()) {
            return 1;
          }
          return 0;
        });
        this.tagsAtualizadas.next({
          tags: [...this.tags],
          count: data.maxItens,
        });
      });
  }

  listarTagsSelect() {
    var queryParams = `?status=1`;

    return this.http
      .get<{
        mensagem: string;
        status: string;
        tags: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .pipe(
        map((data) => {
          return {
            tags: data.tags.map((tag) => {
              return {
                descricao: tag.descricao,
                cor: tag.cor,
                corTexto: tag.corTexto,
                status: tag.status,
                id: tag._id,
              };
            }),
            maxItens: data.maxItens,
          };
        })
      );
  }

  buscarTag(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      tag: Tag;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarTag(tag: Tag) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      tag: Tag;
    }>(`${BACKEND_URL}/${tag.id}`, tag);
  }

  manterTag(tag: Tag, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        tag: Tag;
      }>(`${BACKEND_URL}/${tag.id}`, tag);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        tag: Tag;
      }>(BACKEND_URL, tag);
  }

  excluirTag(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
