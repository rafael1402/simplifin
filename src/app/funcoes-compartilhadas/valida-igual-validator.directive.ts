import {
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
} from "@angular/forms";
import { Directive, Input } from "@angular/core";

@Directive({
  selector: "[validaIgualValidador]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ValidaIgualValidadorDirective,
      multi: true,
    },
  ],
})
export class ValidaIgualValidadorDirective implements Validator {
  @Input() validaIgualValidador: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    const controlToCompare = control.parent.get(this.validaIgualValidador);

    if (controlToCompare && controlToCompare.value === control.value) {
      return {'equal':true}
    }
    else
    return null;
  }
}
