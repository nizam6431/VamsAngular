import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { first } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ConfigureService } from '../../services/configure.service';

@Component({
  selector: 'app-rate-card-popup',
  templateUrl: './rate-card-popup.component.html',
  styleUrls: ['./rate-card-popup.component.scss']
})
export class RateCardPopupComponent implements OnInit {

  formData: any;
  public rateCard: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  mode: string;
  passTypes: any = [{ name: "Daily", type: 'D' }, { name: "Permanent", type: 'P' }]
  
  // validityForPermanent: any = [{ name: "6 Months" }, { name: "1 Year" }, { name: "3 Years" }]
  validityForPermanent: any;
  validityForDaily:any=[{name:"1 Day"}]
  selectedPassType: string;
  categoryType: any;
  validityList: any;
  fieldsList: any = ["passType", "category", "validity", 'price'];
  constructor(public dialogRef: MatDialogRef<RateCardPopupComponent>,
    private formBuilder: FormBuilder,
    private translate:TranslateService ,
    private toastr: ToastrService,
    private configureService:ConfigureService,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
     this.validationMessages = {
      passType: {
        required: translate.instant('rateCard.select_passtype')
      },
      category: {
        required: translate.instant('rateCard.select_category')
      },
      validity: {
        required: translate.instant('rateCard.select_validity')
      },
      price: {
        required: translate.instant('rateCard.enter_rate'),
        min: translate.instant('rateCard.amountMin'),
        max: translate.instant('rateCard.amountMax'),
        pattern:translate.instant('rateCard.digitOnly'),
      },
    }
    }
  ngOnInit(): void {
   
    this.getPassValidity()
    this.formData = this.data;
    this.mode = this.data.mode

     this.rateCard = this.formBuilder.group({
      passType: [this.formData?.data?.passType ? this.formData.data.passType : null, [Validators.required,]],
      category: [this.formData?.data?.categoryName ? this.formData.data.categoryName : null, [Validators.required,]],
      validity: [this.formData?.data?.validity ? this.formData.data.validity : null, [Validators.required,]],
      price:[this.formData?.data?.price ? this.formData.data.price : null,[Validators.required,Validators.max(9999),Validators.min(1)]]
    })
  }
  changeCategory(event) {
    
  }
  getPassValidity() {
     let obj = {
      "masterName": "PassDuration"
    }
    this.configureService.getPassValidity(obj).subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.validityForPermanent = data.data;
       
      }
    });
  }
  getCategoryType() {
    let obj = {
      passType : this.selectedPassType,
      categoryType:""
    }
    this.configureService.getPassCategoryType(obj).subscribe((data) => {
      if (!data.error && data.statusCode == 200) {
        this.categoryType = data.data.list;
      }
    });
  }
  changePassType(event) {
   
    // this.rateCard.controls['passType'].setValue(event.name)
    this.selectedPassType = event.type;
    this.rateCard.controls['category'].setValue(null);
     this.rateCard.controls['validity'].setValue(null);
    if (event.type == 'D') {
      this.validityList = this.validityForDaily
       this.rateCard.controls['validity'].setValue(this.validityList[0].name);
    } else {
       this.validityList=this.validityForPermanent
    }
    this.getCategoryType()
  }
  selectValidity(event) {
   
   
    }

  cancel() {
    // this.rateCard.reset()
    this.dialogRef.close()
  }
  onSubmit() {
   
    if (this.rateCard.status =="VALID") {
      let req = {
        "categoryId": this.rateCard.value.category.id,
        "validity": this.rateCard.value.validity?.name ? this.rateCard.value.validity?.name : this.rateCard.value.validity,
        "price": this.rateCard.value.price,
        "passType": this.rateCard.value.passType.name
      }
      this.configureService.addNewRateCard(req).subscribe((resp) => {
        if (resp.statusCode == 200 && resp.errors == null) {
          this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
          // this.contractorConfigGetByIdRes = resp.data;
          this.dialogRef.close(resp);
        }
        if (resp.statusCode == 400 && resp.errors == null) {
          this.toastr.error(resp.message, this.translate.instant("toster_message.error"));
        }
        
      },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.warning(element.errorMessages[0], this.translate.instant("toster_message.warning"));
            });
          } else {
            this.toastr.error(error.message, this.translate.instant("toster_message.error"));
          }
        })
    } else {
     this.showErrorOnClick()
    }
  }
  updateForm() {
    console.log(this.rateCard.value)
    if (this.rateCard.status =="VALID") {
      let req = {
        "id": this.formData.data.id,
        "price": this.rateCard.value.price,
        }
      this.configureService.updateRateCard(req).subscribe((resp) => {
        if (resp.statusCode == 200 && resp.errors == null) {
           this.toastr.success(resp.message, this.translate.instant("toster_message.success"));
          // this.contractorConfigGetByIdRes = resp.data;
          this.dialogRef.close(resp)
        }
        if (resp.statusCode == 400 && resp.errors == null) { 
          this.toastr.error(resp.message, this.translate.instant("toster_message.error"));
        }
        
      },
        (error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant("toster_message.error"));
            });
          } else {
            this.toastr.error(error.message, this.translate.instant("toster_message.error"));
          }
        })
    } else {
      this.showErrorOnClick();
    }
     
  }
  resetForm() {
    this.rateCard.reset()
    this.selectedPassType = null;
  }
   showErrorOnClick() {
    Object.keys(this.rateCard.controls).forEach((field) => {
      if (this.rateCard.controls[field]["controls"]) {
        this.rateCard.controls[field]["controls"].forEach(
          (formArrayField) => {
            Object.keys(formArrayField["controls"]).forEach((item) => {
              formArrayField["controls"][item].markAsDirty();
              formArrayField["controls"][item].markAsTouched();
            });
          }
        );
      } else {
        this.rateCard.controls[field].markAsDirty();
        this.rateCard.controls[field].markAsTouched();
      }
    });
  }
    public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    if(this.rateCard && this.rateCard.get(control)){
      Object.keys(this.validationMessages[control]).forEach((validator) => {
        if (
          (this.rateCard.get(control).touched ||
            this.rateCard.get(control).dirty) &&
          this.rateCard.get(control).errors
        ) {
          if (this.rateCard.get(control).errors[validator]) {
            messages.push(this.validationMessages[control][validator]);
          }
        }
      });
    }
    return messages;
    }
  checkNumberFieldLength(elem) {
    if (elem.value.length > 4) {
        elem.value = elem.value.slice(0,4); 
    }
}
}
