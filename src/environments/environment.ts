// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  apiEndPoint: '',
  CompanyAPIURL:"", //Dynamically assigned,
  EmployeeAPIURL:"", //Dynamically assigned,
  CompanyId: 0, //Dynamically assigned
  CompanyCode:"", //Dynamically assigned
  Permissions:{}, //Dynamically assigned,
  PremiseId:'',
  Subdomain:'',
  LanguaeCode: '',
  productType:'',
  IsExcel: false,
  DefaultThemeId:'',
  IsForgotPassword: true,
  CommercialBucketName:'vams-development',
  CommercialBucketAccessKeyId:'',
  CommercialBucketSecretAccessKey:'',
  CommercialBucketRegion:'',
  MasterBucketName:'development-master',
  MasterBucketAccessKeyId:'',
  MasterBucketSecretAccessKey:'',
  MasterBucketRegion:'',
  apiRefreshAfterTenMinutes:600000,
  DefaultDarkTheamLogoUrl:"https://vams-development.s3.ap-south-1.amazonaws.com/default-logo/VAMS_Logo_Dark.png",
  DefaultLightTheamLogoUrl:"https://vams-development.s3.ap-south-1.amazonaws.com/default-logo/vams-logo-2.png",
  // DefaultDarkTheamLogoUrl:"https://vams-development.s3.ap-south-1.amazonaws.com/level1/636fb116-1dea-4008-a563-1dec50425780/logo/images%20%283%29.jpg",
  // DefaultLightTheamLogoUrl:"https://vams-development.s3.ap-south-1.amazonaws.com/level1/636fb116-1dea-4008-a563-1dec50425780/logo/images%20%283%29.jpg",
  defaultCountryIsd: 91,
  defaultLogoUrl:"",
  LogoBase64:"",
  DefaultBannerImage:"https://vams-development.s3.ap-south-1.amazonaws.com/default-logo/banner%402x_Reduced.png",
  DefaultPoweredByImage: "https://vams-development.s3.ap-south-1.amazonaws.com/default-logo/powered_by_image.png",
  DefaultPartnerImage: "https://vams-development.s3.ap-south-1.amazonaws.com/default-logo/partner_by_image.png",
  BrandingQRImage: "https://vams-development.s3.ap-south-1.amazonaws.com/default-logo/QR+(1).png",​
  DefaultPrivacyPolicyforEmployee: "https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/privacy-policy.pdf",
  DefaultTermsConditionforEmployee: "https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/TermsConditions.pdf",
  DefaultPrivacyPolicyforVisitor: "https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/privacy-policy_Visitor.pdf",
  DefaultTermsConditionforVisitor: "https://vams-sit.s3.ap-south-1.amazonaws.com/PolicyDocs/TermsConditions_Visitor.pdf",
};



/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.