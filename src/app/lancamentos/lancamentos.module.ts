import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { ChartsModule } from 'ng2-charts';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NovaDespesaComponent } from './despesa/nova-despesa/nova-despesa.component';
import { ListarDespesaComponent } from './despesa/listar-despesa/listar-despesa.component';
import { DespesaRoutingModule } from './despesa/despesa-routing.module';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { TravaPeriodoRoutingModule } from './trava-periodo/trava-periodo-routing.module';
import { TravaPeriodoComponent } from './trava-periodo/trava-periodo.component';
import { ReceitaRoutingModule } from './receita/receita-routing.module';
import { NovaReceitaComponent } from './receita/nova-receita/nova-receita.component';
import { ListarReceitaComponent } from './receita/listar-receita/listar-receita.component';
import { NovaTransferenciaComponent } from './transferencia/nova-transferencia/nova-transferencia.component';
import { ListarTransferenciaComponent } from './transferencia/listar-transferencia/listar-transferencia.component';
import { TransferenciaRoutingModule } from './transferencia/transferencia-routing.module';
import { MetaModule } from '../metas/meta.module';
import { UtilModule } from '../funcoes-compartilhadas/util.module';
import { CadastroModule } from '../cadastro/cadastro.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSelectModule,
    ChartsModule,
    MetaModule,
    DespesaRoutingModule,
    ReceitaRoutingModule,
    TransferenciaRoutingModule,
    TravaPeriodoRoutingModule,
    CadastroModule,
    UtilModule,
    BsDropdownModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
  ],
  declarations: [
    NovaDespesaComponent,
    ListarDespesaComponent,
    NovaReceitaComponent,
    ListarReceitaComponent,
    NovaTransferenciaComponent,
    ListarTransferenciaComponent,
    TravaPeriodoComponent,
  ],
})
export class LancamentosModule {}
