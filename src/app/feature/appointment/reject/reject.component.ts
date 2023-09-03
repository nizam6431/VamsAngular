import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms/';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import {DataService} from '../services/data.service'

@Component({
  selector: 'app-reject',
  templateUrl: './reject.component.html',
  styleUrls: ['./reject.component.css']
})
export class RejectComponent implements OnInit {
  private validationMessages: { [key: string]: { [key: string]: string } };
  name:string="Sample Sharma";
  public formCancel: FormGroup;
  reasonData:any[]=[];

  constructor(private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<RejectComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dataService:DataService
    ) {
      this.validationMessages = {
        reason: {
          required: 'Please select reason.'
        },
      }
     }

  ngOnInit(): void {
    this.getReason();
    this.createForm();
  }

  createForm(){
    this.formCancel = this.formBuilder.group({
      reason:[null,[Validators.required]],
      note:['']
    });
  }

  getReason(){
    this.dataService.getReasons().subscribe((data)=>{
      this.reasonData = data['Reasons'];
    })
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.formCancel.get(control).touched || this.formCancel.get(control).dirty) && this.formCancel.get(control).errors) {
        if (this.formCancel.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  Yes(){
  }

}
