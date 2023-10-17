import { Directive, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, Validator, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appDniValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: DniValidatorDirective,
      multi: true
    }
  ]
})
export class DniValidatorDirective implements Validator {
  @Input('appDniValidator') dniLength!: number;

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;

    if (value && !/^\d+$/.test(value)) {
      return { invalidCharacters: true };
    }

    if (value && value.length !== this.dniLength) {
      return { invalidLength: true };
    }

    return null;
  }
}
