import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";

import { ListarCategoriaComponent } from "./categoria/listar-categoria/listar-categoria.component";
import { NovaCategoriaComponent } from "./categoria/nova-categoria/nova-categoria.component";
import { CategoriaRoutingModule } from "./categoria/categoria-routing.module";
import { FormaPagamentoRoutingModule } from "./forma-pagamento/forma-pagamento-routing.module";
import { NovaFormaPagamentoComponent } from "./forma-pagamento/nova-forma-pagamento/nova-forma-pagamento.component";
import { ListarFormaPagamentoComponent } from "./forma-pagamento/listar-forma-pagamento/listar-forma-pagamento.component";
import { CentroRoutingModule } from "./centro/centro-routing.module";
import { NovoCentroComponent } from "./centro/novo-centro/novo-centro.component";
import { ListarCentroComponent } from "./centro/listar-centro/listar-centro.component";
import { ContaRoutingModule } from './conta/conta-routing.module';
import { NovaContaComponent } from './conta/nova-conta/nova-conta.component';
import { ListarContaComponent } from './conta/listar-conta/listar-conta.component';
import { TagRoutingModule } from './tag/tag-routing.module';
import { ListarTagComponent } from './tag/listar-tag/listar-tag.component';
import { NovaTagComponent } from './tag/nova-tag/nova-tag.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RlarPaginationComponent } from '../funcoes-compartilhadas/paginate.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CategoriaRoutingModule,
    FormaPagamentoRoutingModule,
    CentroRoutingModule,
    ContaRoutingModule,
    TagRoutingModule,
    BsDropdownModule.forRoot(),
  ],
  declarations: [
    RlarPaginationComponent,
    ListarCategoriaComponent,
    ListarFormaPagamentoComponent,
    ListarCentroComponent,
    ListarContaComponent,
    ListarTagComponent,
    NovaCategoriaComponent,
    NovaFormaPagamentoComponent,
    NovoCentroComponent,
    NovaContaComponent,
    NovaTagComponent,
  ],
  exports: [RlarPaginationComponent]
})
export class CadastroModule {}
