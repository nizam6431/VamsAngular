import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { FileUploadService } from '../../services/file-upload.service';
@Component({
  selector: 'app-bulk-upload',
  templateUrl: './bulk-upload.component.html',
  styleUrls: ['./bulk-upload.component.scss']
})
export class BulkUploadComponent implements OnInit {
  private validationMessages: { [key: string]: { [key: string]: string } };
  public bulkUploadForm: FormGroup;
  public preScheduleForm: FormGroup;
  public fileName: string;
  isShow = false;
  isFileTypeError = false;
  public bulkDataFile;
  public fileUrl;
  public base64textString = [];
  inputFile: any;

  constructor(
    private fileUploadService: FileUploadService,
    private formBuilder: FormBuilder,
    private translate:TranslateService,
    public dialogRef: MatDialogRef<BulkUploadComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.validationMessages = {
      bulkDataFile: {
        required: this.translate.instant("pop_up_messages.select_file"),
      },
      qrCode: {
        required: this.translate.instant("pop_up_messages.qr_code"),
      }
    };
  }

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.bulkUploadForm = this.formBuilder.group({
      bulkDataFile: [null, [Validators.required]]
    });

    this.preScheduleForm = this.formBuilder.group({
      qrCode: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.bulkUploadForm.invalid) {
      // this.toastrService.warning('There are errors in the formEmployer', 'Could Not Save');
      Object.keys(this.bulkUploadForm.controls).forEach(field => {
        this.bulkUploadForm.controls[field].markAsDirty();
        this.bulkUploadForm.controls[field].markAsTouched();
      });
    } else {
        this.fileUploadService.fileUpload(this.inputFile,this.data?.filepath)
    }
  }

  public showValidationMessages(control: string): string[] {
    const messages: any[] = [];
    Object.keys(this.validationMessages[control]).forEach(validator => {
      if ((this.bulkUploadForm.get(control).touched || this.bulkUploadForm.get(control).dirty) && this.bulkUploadForm.get(control).errors) {
        if (this.bulkUploadForm.get(control).errors[validator]) {
          messages.push(this.validationMessages[control][validator]);
        }
      }
    });
    return messages;
  }

  onFileChange(event) {
    const file = event.target.files[0];
    this.inputFile = file;
    this.base64textString = [];
    if (file) {
      const reader = new FileReader();
      reader.onload = this.handleReaderLoaded.bind(this);
      reader.readAsBinaryString(file);
    }
  }

  onRemoveAttachment() {
    this.fileName = null;
    this.bulkUploadForm.get('bulkDataFile').setValue(null);
    this.isFileTypeError = false;
    this.bulkDataFile = null;
  }


  handleReaderLoaded(e) {
    this.base64textString.push('data:image/png;base64,' + btoa(e.target.result));
    this.fileUrl = btoa(e.target.result).toString();
  }

  cancel() {
    this.dialogRef.close();
  }

  downloadTemplate() {

  }

}
