import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatListOption } from '@angular/material/list';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AppointmentService } from 'src/app/feature/appointment/services/appointment.service';
import { defaultVal, ProductTypes } from '../models/app-common-enum';
import { AccountService } from '../services/account.service';
import { UserService } from '../services/user.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { elementEventFullName } from '@angular/compiler/src/view_compiler/view_compiler';
import { MatOption } from '@angular/material/core';
import { Data } from '../dto/HealthScreening';
// import { defaultVal } from "../../../core/models/app-common-enum";
@Component({
  selector: 'app-sos',
  templateUrl: './sos.component.html',
  styleUrls: ['./sos.component.scss']
})
export class SOSComponent implements OnInit {
  sosForm : FormGroup
  locationList: any=[]
  VisitorList: []
  orignalLocationList: any=[]
  
  
  visitorTypeData: any =[]
  employeeTypeData: any = []
  sosMessageList: any;
  productType:string;
  productTypeList = ProductTypes;
  selectedLocation=[]
  showEmployee: boolean = false;
  showVisitor: boolean = false;
  employeeFlag: boolean = false;
  visitorFlag: boolean = false;
  sosMessageFlag: boolean = false;
  userDetails: any;
  orignalVisitorList: any;
  type: string;
  orignalEmployeeList: any;
  level2Id=[]
  searchKeyVisitor: string = ''
  searchKeyEmployee:string=''
  shortMessage: any;
  filterValue:string=''
  tempLevel2id = []
  finalAppointmentId = []
  showSelectedLocationList = []
  showSelectedEmployeeList = []
  showSelectedVisitorList=[]
  finalEmployeeId = []
  locationNotFound: boolean = false;
  EmployeeNotFound: boolean = false;
  VisitorNotFound: boolean = false;
  unSelectFlag: boolean = true;
  selectedBuilding: any;
  locationId: any;
  constructor(
    public dialogRef: MatDialogRef<SOSComponent>,
    public dialog: MatDialog,
    private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private accountService: AccountService,
    private userService: UserService,
    private toastr: ToastrService,
    private translate: TranslateService,
  ) { 
    this.productType = this.userService.getProductType();
    this.userDetails = this.userService.getUserData();
   
    this.type = this.userDetails?.role?.shortName;

    this.userDetails.level2List.map(element => {
      if (element.isDefault) {
        this.selectedBuilding = element.name;
        this.locationId=element.id
        return;
      }
    })
  }

  ngOnInit(): void {
   
    if (this.productType == this.productTypeList.Commercial) {
          if (this.type == "L1Admin" || this.type == "L2Admin") {
             this.getLocation();
          } else {
             this.unSelectFlag = false;
            let obj = {
              id:this.locationId,
              locationName:  this.selectedBuilding
            }
            this.orignalLocationList.push(obj)
            this.locationList = this.orignalLocationList;
            this.showSelectedLocationList.push(obj)
            this.level2Id.push(this.locationId)
          }
    }
    if (this.productType == this.productTypeList.Enterprise) {
         if (this.type == "L1Admin") {
             this.getLocation();
          } else {
            this.unSelectFlag = false;
            let obj = {
              id:this.locationId,
              locationName:  this.selectedBuilding
            }
            this.orignalLocationList.push(obj)
            this.locationList = this.orignalLocationList;
            this.showSelectedLocationList.push(obj)
            this.level2Id.push(this.locationId)
          }
    }


    // this.getLocation();
    this.getSOSMessage()
    this.createForm()
  }

  createForm(){
    this.sosForm = this.fb.group({
      selectAllLocation:[''],
      location :[],
      isSelectedVisitor:[false],
      isSelectedEmployee:[false],
      visitor:[''],
      employee:[''],
      selectVisitor:[''],
      SOSId:[null],
      SOSMessage: [null],
      selectedBuilding:[this.selectedBuilding]

    })
  }

  /*  closing the Diloagbox  */
  cancelDiloag() {
    this.dialog.closeAll()
  }


  searchvisitor(event, value: any) {
    this.searchKeyVisitor = null;
    this.visitorTypeData=[]
    if (value.length == 0) {
      this.VisitorNotFound = false;
    } 
    this.searchKeyVisitor = value;
    if (this.searchKeyVisitor.length > 2) {
       this.getVisitorList();
    }

    // this.visitorTypeData = this._filter(value);

    if (!value) {
      this.showVisitor = false;
    } else {
      this.showVisitor = true;
    }
   
  }
  searchEmployee(event, value: any) {
    this.searchKeyEmployee = null;
    this.employeeTypeData = [];
    this.searchKeyEmployee = value;
    if (value?.length == 0) {
      this.EmployeeNotFound = false;
    }
    if (this.searchKeyEmployee.length>2) {
       this.getEmployeeList();
    }
   
     if (!value) {
      this.showEmployee = false;
    } else {
      this.showEmployee = true;
    }
  }
 
  getEmployeeList() {
   
   let obj= {
    "pageSize": 0,
    "pageIndex": 0,
    "orderBy": "firstName",
    "orderDirection": "asc",
    "level1Id": this.userDetails?.level1Id,
    "level2Id": this.level2Id,
    "filterData": this.searchKeyEmployee
}
    this.accountService.getEmployeeList(obj).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
        if (data.data.list.length == 0) {
          this.EmployeeNotFound = true
        } else {
          this.EmployeeNotFound = false;
        }
        this.employeeTypeData = data.data.list;
         this.searchKeyEmployee = null;
      
        this.orignalEmployeeList = this.employeeTypeData;
      }

    });
  }
  // get all locations list.
  getLocation() {
    let obj = {
      isDeleted: false
    }
   
     this.accountService.changeLocation(obj).subscribe(resp => {
       if (!resp.error && resp.statusCode == 200) {
        
         this.locationList = resp.data;
         this.orignalLocationList = resp.data;
      }
    });
  }
  // get employee list
  getVisitorList() {
     let obj= {
    "pageSize": 0,
    "pageIndex": 0,
    "orderBy": "firstName",
    "orderDirection": "asc",
    "level1Id": this.userDetails?.level1Id,
    "level2Id": this.level2Id,
    "filterData": this.searchKeyVisitor
    }
    this.accountService.getVisitorList(obj).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
      
         if (data.data.list.length == 0) {
          this.VisitorNotFound = true
        } else {
          this.VisitorNotFound = false;
        }
        this.visitorTypeData = data.data.list;
        this.searchKeyVisitor = null;
          if (this.visitorTypeData.length > 0 && this.finalAppointmentId.length>0) {
          for (let i = 0; i < this.finalAppointmentId.length; i++){
            for (let j = 0;j < this.visitorTypeData.length; j++){
              if (this.visitorTypeData[j]['appointmentId'] == this.finalAppointmentId[i]) {
                this.visitorTypeData[j]['checked'] = true;
              }
            }
          }
        }
        this.orignalVisitorList = this.visitorTypeData;
        // console.log(this.visitorTypeData,'this.visitorTypeData')
      }

    });

  }

  searchLocation(filterValue) {
    this.filterValue = null;
    this.locationList=[]
    this.filterValue = filterValue;
    if (this.filterValue.length == 0) {
      this.locationNotFound = false;
    }
    
   

    this.type="location"
     if (filterValue.length == 0) {
     this.locationList=this.orignalLocationList
    }
    // if (filterValue?.length>2) {
    this.locationList = this._filter(filterValue);
    if (this.locationList.length == 0) {
           this.locationNotFound = true;
         } else {
           this.locationNotFound = false;
         }
    this.filterValue=null
    
  }
  searchVisitor(filterValue) {
    
    this.filterValue = filterValue;
    this.type="visitor"
     if (filterValue.length == 0) {
     this.visitorTypeData=this.orignalVisitorList
    }
    this.visitorTypeData = this._filter(filterValue);
    // this.selectedLocation = this.locationList.filter((element) => element.checked == true)  
  
  }
  getSOSMessage() {
    let obj= {
      "level1Id": this.userDetails.level1Id,
      "level2Id": this.level2Id
    }
    this.accountService.getSOSMessageList(obj).subscribe(data => {
      if (!data.error && data.statusCode == 200) {
      
        this.sosMessageList = data.data.list;
        // console.log(this.visitorTypeData,'this.visitorTypeData')
      }

    });
  }
  
  private _filter(value: string): string[] {
   
    if (this.type == "location") {
       if(typeof(value) == 'string'){
      const filterValue = value.toLowerCase();
      return this.orignalLocationList.filter(option =>option.locationName.toLowerCase().startsWith(filterValue));
    }
    else{
      return []
    }
    }
    if(this.type == "visitor"){
       if(typeof(value) == 'string'){
      const filterValue = value.toLowerCase();
      return this.orignalVisitorList.filter(option =>option.firstName.toLowerCase().startsWith(filterValue) || option.lastName.toLowerCase().startsWith(filterValue));
    }
    else{
      return []
    }
    }
    if(this.type == "employee"){
       if(typeof(value) == 'string'){
         const filterValue = value.toLowerCase();
       
      return this.orignalEmployeeList.filter(option =>option.firstName.toLowerCase().startsWith(filterValue) ||option.lastName.toLowerCase().startsWith(filterValue));
    }
    else{
      return []
    }
    } else {
       return []
    }
    
  }
  // send message
   sendSOS() {
   
     this.employeeFlag = false;
     this.visitorFlag = false;
     this.sosMessageFlag = false;

     let result = true;
     if (this.finalEmployeeId?.length == 0 && !this.sosForm.get("isSelectedEmployee").value && this.finalAppointmentId?.length == 0 && !this.sosForm.get("isSelectedVisitor").value) {
      
       result = false;
       this.employeeFlag = true;
     }
     if (!this.sosForm.get("SOSId").value && !this.sosForm.get("SOSMessage").value) {
       result = false;
       this.sosMessageFlag = true;
     }
    //  message changes
     if (this.sosForm.get('SOSMessage').value) {
       this.shortMessage = this.sosForm.get('SOSMessage').value;
     }
    //  else {
    //    this.sosForm.get('SOSMessage').setValue(this.shortMessage);
    //  }

     if (result) {
       let obj = {
         "level1Id": this.userDetails?.level1Id,
         "level2Id": this.level2Id,
         "employeeId": this.finalEmployeeId,
         "appointmentId": this.finalAppointmentId,
         "sendToAllEmployee": this.sosForm.value.isSelectedEmployee,
         "sendToAllVisitor": this.sosForm.value.isSelectedVisitor,
         "messageId": this.sosForm.value.SOSId,
         "message": this.shortMessage,
         "shortMessage": this.shortMessage
       }
      
       this.accountService.sendEmergencyMessage(obj).subscribe(data => {
         if (!data.error && data.statusCode == 200) {
          //  this.toastr.success(data.message, this.translate.instant('pop_up_messages.success'));
           this.dialogRef.close(data)
         }

       },(error) => {
          if ("errors" in error.error) {
            error.error.errors.forEach((element) => {
              this.toastr.error(element.errorMessages[0], this.translate.instant('pop_up_messages.error'));
            });
          } else {
            this.toastr.error(error.error.Message,this.translate.instant('pop_up_messages.error'));
          }
        }
       );
     }
  }
 
  allSelectedVistor(event:MatCheckboxChange) {
    if (event.checked) {
      // this.visitorFlag = false;
      this.employeeFlag=false
      this.showSelectedVisitorList = [];
      this.finalAppointmentId=[]
    }
  }
  allSelectedEmployee(event: MatCheckboxChange) {
    if (event.checked) {
      this.employeeFlag = false;
      this.showSelectedEmployeeList = [];
      this.finalEmployeeId=[]
    }
  }
  onMessageChange(event) {
    this.sosMessageList.map(element => {
      if (element.id == event.value) {
         this.shortMessage = element.shortMessageTemplate; 
      }
    })
    this.sosForm.get('SOSMessage').setValue(null)
  }
  customMessage(event,value) {
    if (value) {
      this.sosMessageFlag = false;
      this.sosForm.get("SOSId").setValue(null);
      this.shortMessage = null;
    }
  }
 

  removeDuplicate(arr) {
    return[...new Set(arr)]
  }
  displayWith(user){    
    return user && user.name ? user.name : '';  
  }
  displayWith1(user){    
    return user && user.name ? user.name : '';  
  }
  selectLocation(event) {
    if (event.isUserInput) {
      let index = this.showSelectedLocationList.findIndex((element) => element.id == event.source.value.id);
      if (index == -1) {
        this.showSelectedLocationList.push(event.source.value);
         this.level2Id.push(event.source.value.id)
      }
    }
  }
  unselectLocation(data) {
      let index = this.showSelectedLocationList.findIndex((element) => element.id == data.id);
      this.showSelectedLocationList.splice(index, 1)
      let index1 = this.level2Id.findIndex((element) => element== data.id);
      this.level2Id.splice(index1, 1)
      this.removeDuplicate(this.level2Id) 
  }
  selectEmployee(event) {
    if (event.isUserInput) {
      this.employeeFlag = false;
      this.sosForm.get("isSelectedEmployee").setValue(false)
      let index = this.showSelectedEmployeeList.findIndex((element) => element.id == event.source.value.id);
      if (index == -1) {
        this.showSelectedEmployeeList.push(event.source.value);
        this.finalEmployeeId.push(event.source.value.id)
      }
      this.employeeTypeData=[]
     }
  }
   unselectEmployee(data) {
      let index = this.showSelectedEmployeeList.findIndex((element) => element.id == data.id);
      this.showSelectedEmployeeList.splice(index, 1)
     let index1 = this.finalEmployeeId.findIndex((element) => element== data.id);
     this.finalEmployeeId.splice(index1, 1)
  }
  selectVisitor(event) {
    if (event.isUserInput) {
      this.sosForm.get("isSelectedVisitor").setValue(false)
      // this.visitorFlag = false;
      this.employeeFlag = false;
      let index = this.showSelectedVisitorList.findIndex((element) => element.appointmentId == event.source.value.appointmentId);
      if (index == -1) {
        this.showSelectedVisitorList.push(event.source.value);
        this.finalAppointmentId.push(event.source.value.appointmentId)
      }
      this.visitorTypeData=[]
     }
  }
   unselectVisitor(data) {
      let index = this.showSelectedVisitorList.findIndex((element) => element.appointmentId == data.appointmentId);
      this.showSelectedVisitorList.splice(index, 1)
     let index1 = this.finalAppointmentId.findIndex((element) => element== data.appointmentId);
     this.finalAppointmentId.splice(index1, 1)
  
  }
    resetSOS(){
    this.sosForm.reset();
    this.level2Id = [];
    this.sosForm.get("isSelectedVisitor").setValue(false)
    this.sosForm.get("isSelectedEmployee").setValue(false)
    this.showSelectedLocationList = [];
    this.showSelectedEmployeeList = [];
    this.showSelectedVisitorList = [];
    this.finalAppointmentId = []
    this.finalEmployeeId = [];
    this.sosForm.get("SOSId").setValue(null)
      this.sosForm.get("SOSMessage").setValue(null)
      // this.visitorFlag = false;
      this.employeeFlag = false;
      this.sosMessageFlag = false;
  }
  formatListData(data) {
    let res = ''
    if (data?.phone) {
      if (data?.isd) {
        res = res + '(+' + data.isd +" ";
      }
      res=res + data.phone+" )"
    }
   
    return res;
  }
}
