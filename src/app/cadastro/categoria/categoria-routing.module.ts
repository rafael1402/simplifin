import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarCategoriaComponent } from "./listar-categoria/listar-categoria.component";
import { NovaCategoriaComponent } from './nova-categoria/nova-categoria.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Cadastro",
    },
    children: [
      {
        path: "categoria",
        component: ListarCategoriaComponent,
        data: {
          title: "Categoria",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "categoria/nova-categoria",
        component: NovaCategoriaComponent,
        data: {
          title: "Nova categoria",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "categoria/editar-categoria/:id",
        component: NovaCategoriaComponent,
        data: {
          title: "Editar categoria",
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
export class CategoriaRoutingModule {}
