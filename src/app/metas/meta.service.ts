import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Meta, MetaAcompanhamento, MetaItem } from "./meta-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/meta`;

@Injectable({ providedIn: "root" })
export class MetaService {
  constructor(private http: HttpClient, private router: Router) {}

  private metas: Meta[] = [];
  private metasAtualizadas = new Subject<{
    metas: Meta[];
    count: number;
  }>();

  getMetasListener() {
    return this.metasAtualizadas.asObservable();
  }

  criarMeta(meta: Meta) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, meta);
  }

  listarMetas() {
    this.http
      .get<{
        mensagem: string;
        status: string;
        metas: any;
        maxItens: number;
      }>(`${BACKEND_URL}`)
      .subscribe(
        (data) => {
          this.metas = data.metas;
          this.metasAtualizadas.next({
            metas: [...this.metas],
            count: data.maxItens,
          });
        },
        (error) => {
          console.log(error);
          this.metasAtualizadas.next({
            metas: [],
            count: 0,
          });
        }
      );
  }

  buscarMeta(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      meta: Meta;
      metaItens: [MetaItem];
    }>(`${BACKEND_URL}/${id}`);
  }

  acompanharMeta(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      meta: Meta;
      metaAcompanhamento: [MetaAcompanhamento];
    }>(`${BACKEND_URL}/acompanhar/${id}`);
  }

  atualizarMeta(meta: Meta) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      meta: Meta;
    }>(`${BACKEND_URL}/${meta._id}`, meta);
  }

  manterMeta(meta: Meta, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        meta: Meta;
      }>(`${BACKEND_URL}/${meta._id}`, meta);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        meta: Meta;
      }>(BACKEND_URL, meta);
  }

  excluirMeta(meta: Meta) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${meta._id}`
    );
  }
}
