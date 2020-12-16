import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarContaComponent} from "./listar-conta/listar-conta.component";
import { NovaContaComponent } from './nova-conta/nova-conta.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Cadastro",
    },
    children: [
      {
        path: "conta",
        component: ListarContaComponent,
        data: {
          title: "Conta",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "conta/nova-conta",
        component: NovaContaComponent,
        data: {
          title: "Nova conta",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "conta/editar-conta/:id",
        component: NovaContaComponent,
        data: {
          title: "Editar conta",
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
export class ContaRoutingModule {}
