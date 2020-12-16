import { NgModule } from "@angular/core";
import { ConfirmaIgualValidadorDirective } from "./confirma-igual-validator.directive";
import { PercentualValidadorDirective } from "./percentual-validator.directive";
import { ValorValidadorDirective } from "./valor-validator.directive";

@NgModule({
  declarations: [
    ConfirmaIgualValidadorDirective,
    PercentualValidadorDirective,
    ValorValidadorDirective,
  ],
  exports: [
    ConfirmaIgualValidadorDirective,
    PercentualValidadorDirective,
    ValorValidadorDirective,
  ],
})
export class UtilModule {}
