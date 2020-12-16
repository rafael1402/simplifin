import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarTransferenciaComponent } from "./listar-transferencia/listar-transferencia.component";
import { NovaTransferenciaComponent } from './nova-transferencia/nova-transferencia.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Lancamentos",
    },
    children: [
      {
        path: "transferencias",
        component: ListarTransferenciaComponent,
        data: {
          title: "Transferencia",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "transferencias/nova-transferencia",
        component: NovaTransferenciaComponent,
        data: {
          title: "Nova transferencia",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "transferencias/editar-transferencia/:id",
        component: NovaTransferenciaComponent,
        data: {
          title: "Editar transferencia",
        },
        canActivate: [AutenticacaoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AutenticacaoGuard],
})
export class TransferenciaRoutingModule {}
