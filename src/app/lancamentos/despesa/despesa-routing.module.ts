import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarDespesaComponent } from "./listar-despesa/listar-despesa.component";
import { NovaDespesaComponent } from './nova-despesa/nova-despesa.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Lancamentos",
    },
    children: [
      {
        path: "despesas",
        component: ListarDespesaComponent,
        data: {
          title: "Despesa",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "despesas/nova-despesa",
        component: NovaDespesaComponent,
        data: {
          title: "Nova despesa",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "despesas/editar-despesa/:id",
        component: NovaDespesaComponent,
        data: {
          title: "Editar despesa",
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
export class DespesaRoutingModule {}
