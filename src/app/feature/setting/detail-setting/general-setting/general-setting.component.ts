import { Component, createPlatform, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SettingServices } from '../../services/setting.service';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-general-setting',
  templateUrl: './general-setting.component.html',
  styleUrls: ['./general-setting.component.scss']
})
export class GeneralSettingComponent implements OnInit, OnChanges {
  languageCodeList:any[];
  generalSettingForm: FormGroup;
  languageCode: string = ''
  level2Id: number = null

  @Input() updateGeneralSetting;
  userDetails: any;
  constructor(private toastr: ToastrService,
    private userService: UserService,
    private formBuilder: FormBuilder,
    private translate:TranslateService,
    private settingService: SettingServices) {
    
    this.generalSettingForm = this.formBuilder.group({
      selectedLanguageCode: ['', [Validators.required]]
    });
    // this.userDetails = this.userService.getUserData()
    // console.log(this.userDetails)
    this.getAllLanguge();
    this.generalSettingForm = this.formBuilder.group({
      selectedLanguageCode: ['', [Validators.required]]
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (this.updateGeneralSetting) {
      this.updateSetting();
    }
    this.updateGeneralSetting = null;

  }

  ngOnInit(): void {
    // this.level2Id = this.userDetails?.level2Id;
    // console.log(this.level2Id)
    this.settingService.getGeneralSetting(this.level2Id).subscribe(async resp => {
      if (resp.statusCode != 200 && resp.errors != null) {
        this.toastr.error(resp.message, this.translate.instant("pop_up_messages.error"));
      } else {
        this.languageCode = await resp.data['languageCode'];

        this.generalSettingForm = this.formBuilder.group({
          selectedLanguageCode: [this.languageCode, [Validators.required]]
        });
      }
    })

  }

  getAllLanguge() {
    this.languageCodeList=[]
    this.settingService.getLangueDetail(this.level2Id).subscribe( (resp:any) => {

      if (resp.statusCode === 200 && resp.errors === null) {
        this.languageCodeList=resp?.data
      } 
      
    },(error: any) => {
      this.toastr.error(this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("pop_up_messages.error"));
    })
  }

  updateSetting() {
    this.languageCode = this.generalSettingForm.value.selectedLanguageCode;
    this.settingService.updateGeneralSetting(this.languageCode, this.level2Id).subscribe(resp => {
      if (resp.statusCode === 200 && resp.errors === null) {
        this.toastr.success(resp.message, this.translate.instant("pop_up_messages.success"));
        localStorage.setItem('mylang', this.generalSettingForm.value.selectedLanguageCode)
        location.reload();
      } else {
        this.toastr.error(resp.message, this.translate.instant("pop_up_messages.error"));
      }
    },
      (error: any) => {
        this.toastr.error(this.translate.instant("pop_up_messages.something_went_wrong"), this.translate.instant("pop_up_messages.error"));
      }
    )
  }

}
