import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export function atLeastOne(validator: ValidatorFn, controls: string[]) {
  return (group: FormGroup) => {
    if (!controls) {
      controls = Object.keys(group.controls)
    }
    const hasAtLeastOne = group && group.controls && controls
      .some(k => !validator(group.controls[k]));
    if (!hasAtLeastOne) {
      controls.forEach(element => {
        var control = group.controls[element];
        control.setErrors({ atLeastOne: true });
      });
    }
  }
};

export function showValidationMessages(formGroup: FormGroup, control: string): string[] {
  const messages: any[] = [];
  if (this.validationMessages[control]) {
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((formGroup.get(control)?.touched || formGroup.get(control)?.dirty) && formGroup.get(control)?.errors) {
        if (formGroup.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
  }
  return messages;
}

export function showValidationMessageForDynamicContent(controlName: string, formControl: any): string[] {
  const messages: any[] = [];
  if (this.validationMessages[controlName]) {
    Object.keys(this.validationMessages[controlName]).forEach(validator => {
      if (formControl && (formControl.get(controlName)?.touched || formControl.get(controlName)?.dirty) &&
       formControl.get(controlName)?.errors) {
        if (formControl.get(controlName).errors[validator]) {
          messages.push(this.validationMessages[controlName][validator]);
        }
      }
    });
  }
  return messages;
}