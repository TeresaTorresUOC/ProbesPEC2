import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
export function optionalMinLengthValidator(minLength: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const rawValue = control.value;

    if (rawValue === null || rawValue === undefined) {
      return null;
    }

    const value = typeof rawValue === 'string' ? rawValue.trim() : rawValue;
    if (value === '') {
      return null;
    }

    const actualLength = value.length ?? 0;

    if (actualLength < minLength) {
      return {
        minlength: {
          requiredLength: minLength,
          actualLength,
        },
      };
    }

    return null;
  };
}