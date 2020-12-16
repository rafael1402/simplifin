import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarTagComponent } from "./listar-tag/listar-tag.component";
import { NovaTagComponent } from './nova-tag/nova-tag.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Cadastro",
    },
    children: [
      {
        path: "tag",
        component: ListarTagComponent,
        data: {
          title: "Tag",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "tag/nova-tag",
        component: NovaTagComponent,
        data: {
          title: "Nova tag",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "tag/editar-tag/:id",
        component: NovaTagComponent,
        data: {
          title: "Editar tag",
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
export class TagRoutingModule {}
