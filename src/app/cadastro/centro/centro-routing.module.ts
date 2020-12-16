import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarCentroComponent } from "./listar-centro/listar-centro.component";
import { NovoCentroComponent } from './novo-centro/novo-centro.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Cadastro",
    },
    children: [
      {
        path: "centro",
        component: ListarCentroComponent,
        data: {
          title: "Centro",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "centro/novo-centro",
        component: NovoCentroComponent,
        data: {
          title: "Novo centro",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "centro/editar-centro/:id",
        component: NovoCentroComponent,
        data: {
          title: "Editar centro",
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
export class CentroRoutingModule {}
