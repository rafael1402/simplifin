import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { TravaPeriodoComponent } from "./trava-periodo.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Lancamentos",
    },
    children: [
      {
        path: "trava-periodo",
        component: TravaPeriodoComponent,
        data: {
          title: "Encerramento de período",
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
export class TravaPeriodoRoutingModule {}
