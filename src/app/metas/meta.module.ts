import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { ChartsModule } from 'ng2-charts';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { NgxSelectModule } from 'ngx-select-ex';
import { NgxMaskModule, IConfig } from 'ngx-mask'
import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { PercentualValidadorDirective } from '../funcoes-compartilhadas/percentual-validator.directive';
import { ValorValidadorDirective } from '../funcoes-compartilhadas/valor-validator.directive';
import { MetaRoutingModule } from './meta-routing.module';
import { NovaMetaComponent } from './nova-meta/nova-meta.component';
import { AcompanharMetaComponent } from './acompanhar-meta/acompanhar-meta.component';
import { ListarMetaComponent } from './listar-meta/listar-meta.component';
import { UtilModule } from '../funcoes-compartilhadas/util.module';
import { CadastroModule } from '../cadastro/cadastro.module';

export const options: Partial<IConfig> | (() => Partial<IConfig>) = null;

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    NgxSelectModule,
    ChartsModule,
    MetaRoutingModule,
    ReactiveFormsModule,
    UtilModule,
    CadastroModule,
    BsDropdownModule.forRoot(),
    NgxMaskModule.forRoot(),
    NgxDaterangepickerMd.forRoot(),
  ],
  declarations: [
    NovaMetaComponent,
    ListarMetaComponent,
    AcompanharMetaComponent,

  ],
})
export class MetaModule {}
