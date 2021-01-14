import { NgModule } from "@angular/core";
import { ConfirmaIgualValidadorDirective } from "./confirma-igual-validator.directive";
import { PercentualValidadorDirective } from "./percentual-validator.directive";
import { ValidaIgualValidadorDirective } from "./valida-igual-validator.directive";
import { ValorValidadorDirective } from "./valor-validator.directive";

@NgModule({
  declarations: [
    ConfirmaIgualValidadorDirective,
    ValidaIgualValidadorDirective,
    PercentualValidadorDirective,
    ValorValidadorDirective,
  ],
  exports: [
    ConfirmaIgualValidadorDirective,
    ValidaIgualValidadorDirective,
    PercentualValidadorDirective,
    ValorValidadorDirective,
  ],
})
export class UtilModule {}
