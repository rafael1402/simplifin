import {
  Validator,
  AbstractControl,
  NG_VALIDATORS,
} from "@angular/forms";
import { Directive, Input } from "@angular/core";

@Directive({
  selector: "[valorValidador]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValorValidadorDirective,
      multi: true,
    },
  ],
})
export class ValorValidadorDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    const perc = +control.value;
    if (perc <= 0) {
      return {'invalidValor':true}
    }
    return null;
  }
}
