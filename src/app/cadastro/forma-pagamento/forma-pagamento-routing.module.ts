import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AutenticacaoGuard } from "../../autenticacao/autenticacao.guard";
import { ListarFormaPagamentoComponent } from "./listar-forma-pagamento/listar-forma-pagamento.component";
import { NovaFormaPagamentoComponent } from './nova-forma-pagamento/nova-forma-pagamento.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Cadastro",
    },
    children: [
      {
        path: "forma-pagamento",
        component: ListarFormaPagamentoComponent,
        data: {
          title: "Forma de pagamento",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "forma-pagamento/nova-forma-pagamento",
        component: NovaFormaPagamentoComponent,
        data: {
          title: "Nova forma de pagamento",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "forma-pagamento/editar-forma-pagamento/:id",
        component: NovaFormaPagamentoComponent,
        data: {
          title: "Editar forma de pagamento",
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
export class FormaPagamentoRoutingModule {}
