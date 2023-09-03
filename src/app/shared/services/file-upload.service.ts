import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as S3 from 'aws-sdk/clients/s3';
import * as moment from "moment";
import { map } from 'rxjs/operators';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import s3ParseUrl from 's3-url-parser';
@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  restApi: any;

  constructor(    
    private _sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private userService:UserService,private http: HttpClient, @Inject(API_CONFIG) private endPoints: any) { 
    this.restApi = endPoints;
  }

  fileUpload(file, bucketSavePath: string) {
    const contentType = file.type;
    let bucket;
    let BucketName = "";
    
    //for for superadmin login
    if (environment.Subdomain == 'sysadmin') {
      bucket = new S3(
        {
          accessKeyId: environment.MasterBucketAccessKeyId,
          secretAccessKey: environment.MasterBucketSecretAccessKey,
          region: environment.MasterBucketRegion,
        }
      );
      BucketName = environment.MasterBucketName
    } else {
      bucket = new S3(
        {
          accessKeyId: environment.CommercialBucketAccessKeyId,
          secretAccessKey: environment.CommercialBucketSecretAccessKey,
          region: environment.CommercialBucketRegion,
        }
      );
      BucketName = environment.CommercialBucketName
    }
    let fileName = (file?.name)?(file.name):new Date().getTime+".jpeg";
    const params = {
      Bucket: BucketName,
      Key: bucketSavePath,
      Body: file,
      ACL: 'private',
      ContentType: contentType
    };
    return bucket.upload(params)
  }

  imageUplod(file, bucketSavePath: string) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: environment.CommercialBucketAccessKeyId,
        secretAccessKey: environment.CommercialBucketSecretAccessKey,
        region: environment.CommercialBucketRegion,
      }
    );
    let fileName = (file?.name)?(file.name):"my.jpeg";
    const params = {
      Bucket: environment.CommercialBucketName,
      Key: bucketSavePath+fileName,
      Body: file,
      ACL: 'private',
      ContentType: contentType
    };
    console.log(params)
    return bucket.upload(params)
  }

  fileUploadForWebCam(file, bucketSavePath: string,fileContent,fileName) {
    const contentType = file?._mimeType;
    const bucket = new S3(
      {
        accessKeyId: environment.CommercialBucketAccessKeyId,
        secretAccessKey: environment.CommercialBucketSecretAccessKey,
        region: environment.CommercialBucketRegion,
      }
    );
    const params = {
      Bucket: environment.CommercialBucketName,
      Key: bucketSavePath+fileName,
      Body: fileContent,
      ACL: 'private',
      ContentType: contentType
    };
    return bucket.upload(params)
  }

  getContentFromS3Url(url:string){
    let bucket;
    let BucketName = "";
    if (environment.Subdomain == "sysadmin") {
      // console.log("test")
       bucket = new S3(
        {
          accessKeyId: environment.MasterBucketAccessKeyId,
          secretAccessKey: environment.MasterBucketSecretAccessKey,
          region: environment.MasterBucketRegion,
        }
      );
      BucketName = environment.MasterBucketName;
    } else {
       bucket = new S3(
        {
          accessKeyId: environment.CommercialBucketAccessKeyId,
          secretAccessKey: environment.CommercialBucketSecretAccessKey,
          region: environment.CommercialBucketRegion,
        }
      );
      BucketName = environment.CommercialBucketName;
    }
    const params = {
      Bucket: BucketName,
      Key: url,
    };
    return bucket.getObject(params)
  }
  getContentFormCumertialS3Url(url: string) {
    let bucket;
    let BucketName = "";
    bucket = new S3(
      {
        accessKeyId: environment.CommercialBucketAccessKeyId,
        secretAccessKey: environment.CommercialBucketSecretAccessKey,
        region: environment.CommercialBucketRegion,
      }
    );
    BucketName = environment.CommercialBucketName;
    const params = {
      Bucket: BucketName,
      Key: url,
    };
    return bucket.getObject(params)
  }

  getS3File(key:string){
    if(key.includes('?')){
      key = key.split('?')[0];
    }
    const bucket = new S3(
      {
        accessKeyId: environment.CommercialBucketAccessKeyId,
        secretAccessKey: environment.CommercialBucketSecretAccessKey,
        region: environment.CommercialBucketRegion,
      }
    );
    const params2 = {
      Bucket: environment.CommercialBucketName,
      Key: key,
    };

    let headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'Basic ' + btoa('username:password')
    })

    bucket.getObject(params2, function(err, data) {
      if (err) {
        console.error(err); // an error occurred
      } else {
        
      }
    });
    return bucket.getSignedUrl('getObject',params2);
  }


  downloadTemplate() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.post<any>(environment.CompanyAPIURL + this.restApi.APPOINTMENT_TEMPLATE, {}, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data
      }));
  }

  downloadEmployeeTemplate(level1) {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.post<any>(environment.CompanyAPIURL + this.restApi.Export_Import_Export_Employee_Template, level1, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data
      }));
  }

  downloadCompanyTemplate() {
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.post<any>(environment.CompanyAPIURL + this.restApi.CompanySampleFile, {}, { headers: headers, responseType: 'blob' as 'json' })
      .pipe(map(data => {
        return data
      }));
  }

  uploadByFile(formData:FormData): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.APPOINTMENT_IMPORT}`,formData,{responseType: 'blob' as 'json'})
    .pipe(map(data => {
      return data;
    }));
  }
  uploadCompanyFile(formData:FormData): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.Submit_Upload_company}`,formData,{responseType: 'blob' as 'json'})
    .pipe(map(data => {
      return data;
    }));
  }

  uploadEmployeeFile(formData:FormData): Observable<any>{
    let headers = new HttpHeaders();
    headers = headers.set('Accept', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.Export_Import_Validate_Employees}`,formData,{responseType: 'blob' as 'json'})
    .pipe(map(data => {
      return data;
    }));
  }

  submitEmployeeEmail(): Observable<any>{
    return this.http.post<any>(`${environment.CompanyAPIURL}${this.restApi.Export_Import_Import_Employee_Template}`,{})
    .pipe(map(data => {
      return data;
    }));
  }

  NDAFileUpload(file, bucketSavePath: string) {
    const contentType = file.type;
    const bucket = new S3(
      {
        accessKeyId: environment.CommercialBucketAccessKeyId,
        secretAccessKey: environment.CommercialBucketSecretAccessKey,
        region: environment.CommercialBucketRegion,
      }
    );
    let fileExtension = 'pdf'
    if(contentType && contentType.split('/').length>0)
      fileExtension = contentType.split('/')[1];
    let fileName = new Date().getTime()+"."+fileExtension;
    const params = {
      Bucket: environment.CommercialBucketName,
      Key: bucketSavePath+fileName,
      Body: file,
      ACL: 'private',
      ContentType: contentType
    };
    return bucket.upload(params)
  }

  encode(data) {
    var str = data.reduce(function(a,b){ return a+String.fromCharCode(b) },'');
    return btoa(str).replace(/.{76}(?=.)/g,'$&\n');
  }

  async handleIamge(url,type){
    let newUrl;
    try{
      let parserContent = s3ParseUrl(url);
      let  resp = await this.getContentFromS3Url(parserContent.key).promise();
      newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/png;base64,' + this.encode(resp?.Body));
    }
    catch(e){
      newUrl = null;
      // let parserContent = s3ParseUrl(type == 'darklogo'?environment.DefaultDarkTheamLogoUrl:environment.DefaultLightTheamLogoUrl);
      // let  resp = await this.getContentFromS3Url(parserContent.key).promise();
      // newUrl = this._sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + this.encode(resp?.Body));
    }
    return newUrl;
  }
}
