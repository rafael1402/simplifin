import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AlterarUsuarioComponent } from "./editar-usuario/editar-usuario.component";
import { AutenticacaoGuard } from "../autenticacao/autenticacao.guard";
import { editarSenhaComponent } from './editar-senha/editar-senha.component';

const routes: Routes = [
  {
    path: "",
    data: {
      title: "Usuário",
    },
    children: [
      {
        path: "alterar-usuario",
        component: AlterarUsuarioComponent,
        data: {
          title: "Alterar meus dados",
        },
        canActivate: [AutenticacaoGuard],
      },
      {
        path: "alterar-senha",
        component: editarSenhaComponent,
        data: {
          title: "Alterar minha senha",
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
export class UsuarioRoutingModule {}
