import {
  Validator,
  AbstractControl,
  NG_VALIDATORS,
} from "@angular/forms";
import { Directive, Input } from "@angular/core";

@Directive({
  selector: "[percentualValidador]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PercentualValidadorDirective,
      multi: true,
    },
  ],
})
export class PercentualValidadorDirective implements Validator {

  validate(control: AbstractControl): { [key: string]: any } | null {
    const perc = +control.value;
    if (perc > 100) {
      return {'invalidPerc':true}
    }
    return null;
  }
}
