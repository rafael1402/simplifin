import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Transferencia, TransferenciaFull, RepeticaoTipo } from "./transferencia-model";
import { Router } from "@angular/router";
import { map } from "rxjs/operators";
import { Subject } from "rxjs";
import { environment } from "../../../environments/environment";

const BACKEND_URL = `${environment.apiUrl}/transferencia`;

@Injectable({ providedIn: "root" })
export class TransferenciaService {
  constructor(private http: HttpClient, private router: Router) {}

  private lancamentos: TransferenciaFull[] = [];
  private lancamentosAtualizadas = new Subject<{
    lancamentos: TransferenciaFull[];
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

  getTransferenciasListener() {
    return this.lancamentosAtualizadas.asObservable();
  }

  criarTransferencia(transferencia: Transferencia) {
    return this.http.post<{
      mensagem: string;
      status: string;
      retorno: string;
    }>(BACKEND_URL, transferencia);
  }

  listarTransferencias(dataInicio: string, dataFim: string) {
    var queryParams = "";
    if (dataInicio) {
      queryParams = `?dataInicio=${dataInicio}&dataFim=${dataFim}`;
    }

    this.http
      .get<{
        mensagem: string;
        status: string;
        transferencias: any;
        maxItens: number;
      }>(`${BACKEND_URL}${queryParams}`)
      .subscribe((data) => {
        this.lancamentos = data.transferencias;
        this.lancamentosAtualizadas.next({
          lancamentos: [...this.lancamentos],
          count: data.maxItens,
        });
      });
  }

  buscarTransferencia(id: string) {
    return this.http.get<{
      mensagem: string;
      status: string;
      transferencia: Transferencia;
    }>(`${BACKEND_URL}/${id}`);
  }

  atualizarTransferencia(transferencia: Transferencia) {
    return this.http.patch<{
      mensagem: string;
      status: string;
      transferencia: Transferencia;
    }>(`${BACKEND_URL}/${transferencia._id}`, transferencia);
  }

  manterTransferencia(transferencia: Transferencia, edit: boolean) {
    if (edit)
      return this.http.patch<{
        mensagem: string;
        status: string;
        transferencia: Transferencia;
      }>(`${BACKEND_URL}/${transferencia._id}`, transferencia);
    else
      return this.http.post<{
        mensagem: string;
        status: string;
        transferencia: Transferencia;
      }>(BACKEND_URL, transferencia);
  }

  excluirTransferencia(id: string) {
    return this.http.delete<{ mensagem: string; status: string }>(
      `${BACKEND_URL}/${id}`
    );
  }
}
