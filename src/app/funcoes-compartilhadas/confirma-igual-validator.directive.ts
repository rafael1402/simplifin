import {
  Validator,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS,
} from "@angular/forms";
import { Directive, Input } from "@angular/core";

@Directive({
  selector: "[confirmacaoIgualValidador]",
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: ConfirmaIgualValidadorDirective,
      multi: true,
    },
  ],
})
export class ConfirmaIgualValidadorDirective implements Validator {
  @Input() confirmacaoIgualValidador: string;
  validate(control: AbstractControl): { [key: string]: any } | null {
    const controlToCompare = control.parent.get(this.confirmacaoIgualValidador);
    if (controlToCompare && controlToCompare.value !== control.value) {
      return {'notEqual':true}
    }
    else
    return null;
  }
}
