import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TravaPeriodo } from "./trava-periodo-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/trava-periodo`;

@Injectable({ providedIn: "root" })
export class TravaPeriodoService {
  constructor(private http: HttpClient, private router: Router) {}

  private travaPeriodo = new Subject<TravaPeriodo>();

   buscarTravaPeriodo() {
    return this.http.get<{
      mensagem: string;
      status: string;
      travaPeriodo: TravaPeriodo;
    }>(`${BACKEND_URL}`);
  }

  atualizarTravaPeriodo(travaPeriodo: TravaPeriodo) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      travaPeriodo: TravaPeriodo;
    }>(`${BACKEND_URL}`, travaPeriodo);
  }

}
