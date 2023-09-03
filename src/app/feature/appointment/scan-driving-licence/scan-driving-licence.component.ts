import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WebcamImage } from 'ngx-webcam';
import { Observable, Subject } from 'rxjs';
import { AppointmentService } from '../services/appointment.service';
import { DriverData } from '../models/walkin';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-scan-driving-licence',
  templateUrl: './scan-driving-licence.component.html',
  styleUrls: ['./scan-driving-licence.component.scss']
})
export class ScanDrivingLicenceComponent implements OnInit {
  showWebcam = true;
  webcamImage: WebcamImage | undefined;
  private trigger: Subject<void> = new Subject<void>();
  isPhotoCaptured: boolean | undefined;
  private nextWebcam: Subject<boolean | string> = new Subject<boolean | string>();
  drivingLicenseData:DriverData;

  constructor(
    public appointmentService:AppointmentService,
    private dialogRef: MatDialogRef<ScanDrivingLicenceComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
  }
  handleImage(webcamImage: WebcamImage) {
    this.showWebcam = false;
    this.webcamImage = webcamImage;
  }

  convertToBlob(imgData){
    var byteString = atob(imgData.split(',')[1]);
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
     for (var i = 0; i < byteString.length; i++)
      {
       ia[i] = byteString.charCodeAt(i);
      }
     return new Blob([ab], { 'type': 'image/jpg' });
   }

  get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  takeSnapshot(): void {
    this.isPhotoCaptured = true;
    this.trigger.next();
  }
  cancel(){
    this.dialogRef.close();
  }
  scanLicense(){
    const formData = new FormData();
    let filePath = this.convertToBlob(this.webcamImage['_imageAsDataUrl']);
    formData.append('file',filePath, "check.jpg");
    this.appointmentService.scanDrivingLicense(formData).subscribe((data)=>{
      this.drivingLicenseData = data?.data;
      this.dialogRef.close({"driverData":this.drivingLicenseData})
    },
    (error)=>{
      this.toastr.error(error.error.Message)
    })
  }
}
