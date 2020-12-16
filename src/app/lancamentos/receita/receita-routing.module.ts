import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarReceitaComponent } from "./listar-receita/listar-receita.component";
import { NovaReceitaComponent } from './nova-receita/nova-receita.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Lancamentos",
    },
    children: [
      {
        path: "receitas",
        component: ListarReceitaComponent,
        data: {
          title: "Receita",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "receitas/nova-receita",
        component: NovaReceitaComponent,
        data: {
          title: "Nova receita",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "receitas/editar-receita/:id",
        component: NovaReceitaComponent,
        data: {
          title: "Editar receita",
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
export class ReceitaRoutingModule {}
