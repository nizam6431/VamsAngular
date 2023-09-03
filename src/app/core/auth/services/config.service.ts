import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { env } from 'process';
import { forkJoin } from 'rxjs';

import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { API_CONFIG } from '../../constants/rest-api.constants';
import { s3label } from '../../constants/s3config'
@Injectable({ providedIn: 'root' })

export class ConfigService {
  private config: any;
  restApi: any;
  constructor(private http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }

  public loadConfig(): Promise<any> {
    var date = new Date().getTime();
    return this.http.get("assets/dummy-json/appsettings.json?date=" + date)
      .pipe(map(res => res))
      .toPromise()
      .then(settings => {
        this.config = settings;
      }
      );
  }

  getMasterDetails() {
    let hostName = window.location.hostname.split('.')[0];
    let reqObj = { "subDomain": hostName }
    return this.http.post(`${this.config.apiEndPoint}${this.restApi.GET_MASTER_DETAILS}`, reqObj)
      .pipe(map(resp => {
        if (resp['data']) {
          // this.setS3Configuration();
          this.setS3ConfigurationByAPI()
          environment.CompanyAPIURL = this.config.apiEndPoint;
          environment.LanguaeCode = resp['data'].defaultLanguageCode || "en_US";
          environment.IsExcel = resp['data'].isEXCEL;
          environment.Subdomain = resp['data'].subdomain;
          environment.DefaultThemeId = resp['data'].defaultThemeId;
          environment.IsForgotPassword = resp['data'].isForgotPassword;
          environment.defaultLogoUrl = resp['data'].logoUrl;
          environment.LogoBase64 = resp['data'].logoBase64String;
          environment.DefaultBannerImage = resp['data'].bannerImgBase64String;
          environment.DefaultPartnerImage = resp['data'].partnershipImgBase64String;
          environment.DefaultPoweredByImage = resp['data'].poweredByImgBase64String;
          environment.productType = resp['data'].productType;
          // localStorage.setItem('mylang',resp['data'].defaultLanguageCode)
          return true;
        } else {
          return false;
        }
      }, error => { return false }))
  }

  setSuperadmin() {
    environment.CompanyAPIURL = this.config.apiEndPoint;
    environment.LanguaeCode = "en-US";
    environment.IsExcel = false;
    environment.Subdomain = window.location.hostname.split('.')[0];
    this.setS3ConfigurationByAPI();
    return true;
  }

  public get configuration(): any {
    return this.config;
  }

  public setS3Configuration() {
    var date = new Date().getTime();
    return this.http.get("assets/dummy-json/s3-config.json?date=" + date)
      .pipe(map(res => res))
      .toPromise()
      .then(settings => {
          let s3Setup = settings[this.config?.s3enviroment];
          environment.CommercialBucketAccessKeyId = s3Setup[s3label.AccessKeyId];
          environment.CommercialBucketName = s3Setup[s3label.BucketName];
          environment.CommercialBucketSecretAccessKey = s3Setup[s3label.SecretAccessKey];
          environment.CommercialBucketRegion = s3Setup[s3label.Region];
        }
      );
  }

  public setS3ConfigurationByAPI() {
    let apiCall = [];
    apiCall.push(this.http.post(this.config.apiEndPoint + this.restApi.GET_COMMERCIAL_S3, null));
    // TODO : Add if confition if master
    if(environment.Subdomain == 'sysadmin'){
      apiCall.push(this.http.post(this.config.apiEndPoint  + this.restApi.GET_MASTER_S3, null));
    }
    // apiCall.push(this.http.post(this.config.apiEndPoint  + this.restApi.GET_MASTER_S3, null));
    forkJoin(apiCall).subscribe((resp)=>{
        if(resp && resp[0]){
          this.setCommercialS3(resp[0]);
        }
        if(resp && resp[1]){
          this.setMasterS3(resp[1]);
        }
        this.setDefaultComplexLogo()
    })
  }
  setCommercialS3(response){
    if(response.statusCode == 200 && response.errors == null ){
      if(response && response.data){
        let s3Setup = response.data;
        environment.CommercialBucketAccessKeyId = s3Setup[s3label.AccessKeyId];
        environment.CommercialBucketName = s3Setup[s3label.BucketName];
        environment.CommercialBucketSecretAccessKey = s3Setup[s3label.SecretAccessKey];
        environment.CommercialBucketRegion = s3Setup[s3label.Region];
      }
    }
  }
  setMasterS3(response){
    if(response.statusCode == 200 && response.errors == null){
      if(response && response.data){
        let s3Setup = response.data
        environment.MasterBucketAccessKeyId = s3Setup[s3label.AccessKeyId];
        environment.MasterBucketName = s3Setup[s3label.BucketName];
        environment.MasterBucketSecretAccessKey = s3Setup[s3label.SecretAccessKey];
        environment.MasterBucketRegion = s3Setup[s3label.Region];
      }
    }
  }
  setDefaultComplexLogo(){
    if(environment && environment.CommercialBucketName && environment.CommercialBucketName == "vams-sit"){
      environment.DefaultDarkTheamLogoUrl = "https://vams-sit.s3.ap-south-1.amazonaws.com/default-logo/VAMS_Logo_Dark.png";
      environment.DefaultLightTheamLogoUrl = "https://vams-sit.s3.ap-south-1.amazonaws.com/default-logo/vams-logo-2.png";
      environment.DefaultBannerImage = "https://vams-sit.s3.ap-south-1.amazonaws.com/default-logo/banner%402x_Reduced.png";
      environment.DefaultPoweredByImage = "https://vams-sit.s3.ap-south-1.amazonaws.com/default-logo/powered_by_image.png",
      environment.DefaultPartnerImage = "https://vams-sit.s3.ap-south-1.amazonaws.com/default-logo/partner_by_image.png",
      environment.BrandingQRImage = "https://vams-sit.s3.ap-south-1.amazonaws.com/default-logo/QR+(1).png",
      environment.DefaultPrivacyPolicyforEmployee = "https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/privacy-policy.pdf",
      environment.DefaultTermsConditionforEmployee = "https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/TermsConditions.pdf",
      environment.DefaultPrivacyPolicyforVisitor = "https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/privacy-policy_Visitor.pdf",
      environment.DefaultTermsConditionforVisitor ="https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/TermsConditions_Visitor.pdf"
    }
    if(environment && environment.CommercialBucketName && environment.CommercialBucketName == "vams-uat"){

      environment.DefaultDarkTheamLogoUrl = "https://vams-uat.s3.ap-south-1.amazonaws.com/default-logo/VAMS_Logo_Dark.png",
      environment.DefaultLightTheamLogoUrl = "https://vams-uat.s3.ap-south-1.amazonaws.com/default-logo/vams-logo-2.png",
      environment.DefaultBannerImage = "https://vams-uat.s3.ap-south-1.amazonaws.com/default-logo/banner%402x_Reduced.png",
      environment.DefaultPoweredByImage = "https://vams-uat.s3.ap-south-1.amazonaws.com/default-logo/powered_by_image.png",
      environment.DefaultPartnerImage ="https://vams-uat.s3.ap-south-1.amazonaws.com/default-logo/partner_by_image.png",
      environment.BrandingQRImage = "https://vams-uat.s3.ap-south-1.amazonaws.com/default-logo/QR+(1).png",
      environment.DefaultPrivacyPolicyforEmployee = "https://vams-uat.s3.ap-south-1.amazonaws.com/PolicyDocs/privacy-policy.pdf",
      environment.DefaultTermsConditionforEmployee = "https://vams-uat.s3.ap-south-1.amazonaws.com/PolicyDocs/TermsConditions.pd",
      environment.DefaultPrivacyPolicyforVisitor = "https://vams-uat.s3.ap-south-1.amazonaws.com/PolicyDocs/privacy-policy_Visitor.pdf",
      environment.DefaultTermsConditionforVisitor = "https://vams-uat.s3.ap-south-1.amazonaws.com/PolicyDocs/TermsConditions_Visitor.pdf"

    

    }
  }
}
