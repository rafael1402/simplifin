import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Import Containers
import { DefaultLayoutComponent } from "./containers";

import { P404Component } from "./error/404.component";
import { P500Component } from "./error/500.component";
import { LoginComponent } from "./autenticacao/login/login.component";
import { NovoUsuarioComponent } from './usuario/novo-usuario/novo-usuario.component';


export const routes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "404",
    component: P404Component,
    data: {
      title: "Page 404",
    },
  },
  {
    path: "500",
    component: P500Component,
    data: {
      title: "Page 500",
    },
  },
  {
    path: "login",
    component: LoginComponent,
    data: {
      title: "Login Page",
    },
  },
  {
    path: "novo-usuario",
    component: NovoUsuarioComponent,
    data: {
      title: "Novo usuário",
    },
  },
  {
    path: "",
    component: DefaultLayoutComponent,
    data: {
      title: "Home",
    },
    children: [
      {
        path: "usuario",
        loadChildren: () =>
          import("./usuario/usuario.module").then((m) => m.UsuarioModule),
      },
      {
        path: "cadastro",
        loadChildren: () =>
          import("./cadastro/cadastro.module").then((m) => m.CadastroModule),
      },
      {
        path: "lancamentos",
        loadChildren: () =>
          import("./lancamentos/lancamentos.module").then((m) => m.LancamentosModule),
      },
      {
        path: "meta",
        loadChildren: () =>
          import("./metas/meta.module").then((m) => m.MetaModule),
      },
      {
        path: "home",
        loadChildren: () =>
          import("./home/home.module").then((m) => m.HomeModule),
      },
    ],
  },
  { path: "**", component: P404Component },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
