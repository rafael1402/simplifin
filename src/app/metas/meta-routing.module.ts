import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../autenticacao/autenticacao.guard";
import { AutPremiumGuard } from "../autenticacao/premium.guard";
import { AcompanharMetaComponent } from './acompanhar-meta/acompanhar-meta.component';
import { ListarMetaComponent } from "./listar-meta/listar-meta.component";
import { NovaMetaComponent } from "./nova-meta/nova-meta.component";

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Metas",
    },
    children: [
      {
        path: "metas",
        component: ListarMetaComponent,
        data: {
          title: "Meta",
        },
        canActivate: [AutPremiumGuard,AutenticacaoGuard],
      },
      {
        path: "metas/nova-meta",
        component: NovaMetaComponent,
        data: {
          title: "Nova meta",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "metas/editar-meta/:id",
        component: NovaMetaComponent,
        data: {
          title: "Editar meta",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "metas/acompanhar-meta/:id",
        component: AcompanharMetaComponent,
        data: {
          title: "Acompanhar meta",
        },
        canActivate: [AutenticacaoGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AutPremiumGuard, AutenticacaoGuard],
})
export class MetaRoutingModule {}
