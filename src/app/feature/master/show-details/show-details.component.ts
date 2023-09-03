import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-show-details',
  templateUrl: './show-details.component.html',
  styleUrls: ['./show-details.component.scss']
})
export class ShowDetailsComponent implements OnInit {
  email = new FormControl('', [Validators.required, Validators.email]);
  formType: string = "department-form";
  subLocationDetailsLevel2Id = this.formData.level2Id;
  subLocationDetailsLevel3Id = this.formData.data?.level3Id;
  constructor(@Inject(MAT_DIALOG_DATA) public formData: any) { }

  ngOnInit(): void {
    console.log(this.formData,'formData')
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a value';
    }
    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
