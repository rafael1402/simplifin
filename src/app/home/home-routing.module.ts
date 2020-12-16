import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { AutenticacaoGuard } from '../autenticacao/autenticacao.guard';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    data: {
      title: 'Dashboard'
    },
    canActivate: [AutenticacaoGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [AutenticacaoGuard]

})
export class HomeRoutingModule {}
