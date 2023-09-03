import {
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

export function vaccinationValidator(hsqValueControl: FormControl, dateControl: FormControl, isVaccineQuestion: FormControl) {
  if(isVaccineQuestion.value == true)
  {
   if (hsqValueControl.value == 'Yes' && (dateControl.value == null || dateControl.value == ''))
    {
            dateControl.setErrors({ vaccinationValidator: true });
    }
  }
};