import { Component, Inject, OnInit, TemplateRef } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms/";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { DataService } from "../services/data.service";
import { AppointmentService } from "../services/appointment.service";
import { ToastrService } from "ngx-toastr";
import { first } from "rxjs/operators";
import { AppointmentsStatus } from "src/app/core/models/app-common-enum";
import { environment } from "src/environments/environment";
@Component({
  selector: "app-checkout-modal",
  templateUrl: "./checkout-modal.component.html",
  styleUrls: ["./checkout-modal.component.scss"],
})
export class CheckoutModalComponent implements OnInit {
  currentSlide: number = 1;
  public preScheduleForm: FormGroup;
  private validationMessages: { [key: string]: { [key: string]: string } };
  visitorData: any;
  fromCardCheckIn: boolean;
  appointmentsStatus = AppointmentsStatus;
  isExcel = environment.IsExcel;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CheckoutModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _fb: FormBuilder,
    private dataService: DataService,
    public appointmentService: AppointmentService,
    private toastr: ToastrService
  ) {
    this.validationMessages = {
      cell: {
        required: "Please enter cell number.",
        pattern: "Please enter 10 digit number separated by comma.",
        minlength: "Minimum digits required: 10",
        maxlength: "Maximum digits allowed: 54",
      },
      qrCode: {
        required: "Please enter valid qr code.",
      },
    };
  }

  ngOnInit(): void {
    if (this.data && "startFromSlide" in this.data) {
      this.currentSlide = this.data["startFromSlide"];
      this.fromCardCheckIn = true;
      // this.getData(this.data.appointmentData.id);
      this.visitorData = this.data.appointmentData;
      this.fromCardCheckIn = true;
    }
    this.preScheduleForm = this.formBuilder.group({
      qrCode: [
        null,
        [
          Validators.required,
          Validators.maxLength(30),
          Validators.pattern("[a-zA-Z0-9]*"),
        ],
      ],
    });
  }

  public showValidationMessageForQrCode(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach((validator) => {
      if (
        (this.preScheduleForm.get(control).touched ||
          this.preScheduleForm.get(control).dirty) &&
        this.preScheduleForm.get(control).errors
      ) {
        if (this.preScheduleForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }
  scanSuccessHandler(event, type) {
    if (type === "qrcode") {
      this.getData(4);
    }
    if (type === "usercode") {
      this.getData(parseInt(this.preScheduleForm.value.qrCode));
    }
  }
  getData(appointmentId) {
    this.appointmentService.getAppointmentById(appointmentId)
    .pipe(first())
    .subscribe(
      (resp) => {
        if (resp.statusCode == 200 && resp.errors === null) {
          this.visitorData = resp.data;
          if (!this.fromCardCheckIn) {
            this.currentSlide = this.currentSlide + 1;
          }
        }
      },
      (error) => {
        this.toastr.error(error.error.Message, "Error");
      }
    );
  }
  confirmCheckOut() {
    this.appointmentService
      .checkOutAsync(this.data.appointmentData.id)
      .subscribe(
        (resp) => {
          if (resp.statusCode == 200 && resp.errors === null) {
            this.toastr.success(resp.message, "Success");
            this.dialogRef.close(resp);
          }
        },
        (error) => {
          this.toastr.error(error.error.Message, "Error");
        }
      );
  }
  back() {
    this.currentSlide = this.currentSlide - 1;
  }
  next() {
    this.currentSlide = this.currentSlide + 1;
  }
}
