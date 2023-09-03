import { FormControl } from "@angular/forms/";
import { Select2OptionData } from "ng-select2";
import { CountryISO } from "ngx-intl-tel-input";
import { COUNTRIES_DATA } from "src/app/feature/appointment/models/country-const";
import s3ParseUrl from 's3-url-parser';
import { FileUploadService } from "src/app/shared/services/file-upload.service";


export function parseErrors(response: any) {
  var errors = [];
  for (var key in response) {
    if (key == "error") {
      errors.push(response[key].Message ? response[key].Message : "Something went wrong.");
      // for (var i = 0; i < response[key].length; i++) {
      //   errors.push(response[key][i]);
      // }
    }
  }
  return errors;
}

export function dateFormat(date: Date) {
  const day = date && date.getDate() || -1;
  const dayWithZero = day.toString().length > 1 ? day : '0' + day;
  const month = date && date.getMonth() + 1 || -1;
  const monthWithZero = month.toString().length > 1 ? month : '0' + month;
  const year = date && date.getFullYear() || -1;

  return `${monthWithZero}-${dayWithZero}-${year}`;
}

export function getUTCDate() {
  var currentDate = new Date();
  return new Date(currentDate.getUTCFullYear(),
    currentDate.getUTCMonth(),
    currentDate.getUTCDate(),
    currentDate.getUTCHours(),
    currentDate.getUTCMinutes(),
    currentDate.getUTCSeconds()
  )
}

export function getUTCDateForDate(someDate: Date) {
  return new Date(someDate.getUTCFullYear(),
    someDate.getUTCMonth(),
    someDate.getUTCDate(),
    someDate.getUTCHours(),
    someDate.getUTCMinutes(),
    someDate.getUTCSeconds()
  )
}

export function calcTime(offset: number) {
  // create Date object for current location
  var d = new Date();
  // convert to msec
  // subtract local time zone offset
  // get UTC time in msec
  var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
  // create new Date object for different city
  // using supplied offset
  var nd = new Date(utc + (3600000 * (offset / 60)));
  // return time as a string
  return nd;
}

export function calcUTCTimeForSpecificDate(d: Date, offset: number) {
  var utc = d.getTime() + (-offset * 60000);
  return new Date(utc);
}

export function calcLocalTimeForSpecificDate(d: Date, offset: number) {
  var utc = d.getTime() + (offset * 60000);
  return new Date(utc);
}

export function getTimezoneOffsetFrom(otherTimezone: string) {
  if (otherTimezone === void 0) { otherTimezone = "Asia/Calcutta"; }
  var date = new Date();
  function objFromStr(str: string) {
    var array = str.replace(":", " ").split(" ");
    return {
      day: parseInt(array[0]),
      hour: parseInt(array[1]),
      minute: parseInt(array[2])
    };
  }
  var str = date.toLocaleString(['en-US'], { timeZone: otherTimezone, day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false });
  var other = objFromStr(str);
  str = date.toLocaleString(['en-US'], { day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false });
  var myLocale = objFromStr(str);
  var amsterdamOffset = (other.day * 24 * 60) + (other.hour * 60) + (other.minute);
  var myLocaleOffset = (myLocale.day * 24 * 60) + (myLocale.hour * 60) + (myLocale.minute);
  return -(myLocaleOffset - amsterdamOffset + date.getTimezoneOffset());
}

export function getTimezoneOffset(currentTime: Date, utcTime: Date) {
  var difference = (currentTime).valueOf() - (utcTime).valueOf();
  return millisToMinutesAndSeconds(difference);
}

function millisToMinutesAndSeconds(millis: number) {
  var minutes = Math.ceil(millis / 60000);
  //var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes;
}

export function convertTime12to24(time12h: any) {
  const [time, modifier] = time12h.split(" ");

  let [hours, minutes] = time.split(":");

  if (hours === "12") {
    hours = "00";
  }

  if (modifier != undefined && modifier.toLowerCase() === "pm") {
    hours = parseInt(hours, 10) + 12;
  }

  return `${hours}:${minutes}`;
};

export function convertTime24to12(time: any) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time];

  if (time.length > 1) { // If time format correct
    time = time.slice(1);  // Remove full string match value
    time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
    time[0] = +time[0] % 12 || 12; // Adjust hours
  }
  return time.join(''); // return adjusted time or original string
}


export function _base64ToArrayBuffer(base64: string) {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
    bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}


export function resizeImage(base64Str: string, maxWidth = 400, maxHeight = 350) {
  return new Promise((resolve) => {
    let img = new Image()
    img.src = base64Str
    img.onload = () => {
      let canvas = document.createElement('canvas')
      const MAX_WIDTH = maxWidth
      const MAX_HEIGHT = maxHeight
      let width = img.width
      let height = img.height

      if (width > height) {
        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width
          width = MAX_WIDTH
        }
      } else {
        if (height > MAX_HEIGHT) {
          width *= MAX_HEIGHT / height
          height = MAX_HEIGHT
        }
      }
      canvas.width = width
      canvas.height = height
      let ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL())
    }
  })
}

export function base64ToBufferAsync(base64: string) {
  var dataUrl = base64;

  return fetch(dataUrl)
    .then(res => res.arrayBuffer())
    .then(buffer => {
      return new Uint8Array(buffer);
    })
}

export function printPdf(url: string) {
  //var iframe = this._printIframe;
  //if (!this._printIframe) {
  var iframe = document.createElement('iframe');
  document.body.appendChild(iframe);

  iframe.style.display = 'none';
  iframe.onload = function () {
    setTimeout(function () {
      iframe.focus();
      iframe.contentWindow?.print();
    }, 1);
  };
  //}

  iframe.src = url;
}


export function round5(x: number) {
  return Math.ceil(x / 5) * 5;
}

export function PrintPDF(path: string, callback: any) {
  document.getElementById("print_frame")?.remove();
  var ua = window.navigator.userAgent;
  var msie = ua.indexOf('MSIE ');
  var trident = ua.indexOf('Trident/');
  var edge = ua.indexOf('Edge/');
  var pdf = '';
  var style = 'display:none;size:landscape;position:fixed; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden;';

  if (msie > 0 || trident > 0 || edge > 0) {
    pdf = '<object data="' + path + '" name="print_frame" id="print_frame" style="' + style + '" type="application/pdf">';

    document.body.append(pdf);

    window.print();
  }
  else {
    pdf = '<iframe src="' + path + '" name="print_frame" id="print_frame" style="' + style + '"></iframe>';
    document.body.insertAdjacentHTML('beforeend', pdf);
    setTimeout(function () {
      (window.frames as { [key: string]: any })["print_frame"].focus();
      (window.frames as { [key: string]: any })["print_frame"].print();
      callback();
    }, 2000);
  }
}

export function removeSpecialCharAndSpaces(charString: any) {
  if (charString == '' || charString == null) {
    return '';
  }
  let desired = charString.replace(/[^\w\s]/gi, '');
  return desired.replace(/ /g, '')
}

export function capitalizeFirstLetter(string: string) {
  if (string == '' || string == null) {
    return '';
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{3})(\d{0,3})(\d*)$/);
  // var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return '(' + match[1] + ') ' + match[2] + (match[3] ? '-' + match[3] : "");
  }
  return phoneNumberString;
}


export const templateResult = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }

  return jQuery('<span><span class="flag-icon flag-icon-' + state.additional.trim().toLocaleLowerCase() + ' flag-icon-squared" style="margin-right: 7px;"></span>' + state.text + '</span>');
}

export function matchCustom(params: any, data: any) {
  // If there are no search terms, return all of the data
  if ($.trim(params.term) === '') {
    return data;
  }

  // Do not display the item if there is no 'text' property
  if (typeof data.text === 'undefined') {
    return null;
  }

  // `params.term` should be the term that is used for searching
  // `data.text` is the text that is displayed for the data object
  if (data.text.indexOf(params.term) > -1) {
    var modifiedData = $.extend({}, data, true);
    modifiedData.text += ' (matched)';

    // You can return modified objects from here
    // This includes matching the `children` how you want in nested data sets
    return modifiedData;
  }

  // Return `null` if the term should not be displayed
  return null;
}

export const matcherResult = (term: string, text: string) => {
  text = text.replace("+", "");
  return text.startsWith(term);
}

export const templateSelection = (state: Select2OptionData): JQuery | string => {
  if (!state.id) {
    return state.text;
  }
  return jQuery('<span><span class="flag-icon flag-icon-' + state.additional.trim().toLocaleLowerCase() + ' flag-icon-squared" style="margin-right: 7px;"></span>' + state.text + '</span>');
}
// export function getCountryCode(isdCode) {
//   let countryData = COUNTRIES_DATA.find(
//     (country) => country.dial_code == isdCode
//   );

//   let isdCountryCode = Object.values(CountryISO).filter(
//     (countryIsoCode) => countryIsoCode.toUpperCase() == countryData.code
//   );

//   return isdCountryCode[0];
// }

export function getCountryCode(isdCode, countryName?) {
  let countryData;
  if(countryName) {
  countryData = COUNTRIES_DATA.find(
    (country) => country.dial_code == isdCode 
    // (country) => country.name == countryName
  );
  } else {
    countryData = COUNTRIES_DATA.find(
      (country) => country.dial_code == isdCode
    );
  }
 
  let isdCountryCode = Object.values(CountryISO).filter( 
    (countryIsoCode) => countryIsoCode.toUpperCase() == countryData.code 
  );

  return isdCountryCode[0];
}

export function convertToBlob(imgData: string, contentTye: {}) {
  var byteString = atob(imgData.split(',')[1]);
  var ab = new ArrayBuffer(byteString.length);
  var ia = new Uint8Array(ab);
  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }
  return new Blob([ab], contentTye);
}

export function convertToBinary(x) {
  let accessCantrolNumber = 0;
  let selectedAccessCantrol=[];
  if (x) {
    let bin = 0;
    let rem, i = 1, step = 1;
    let iter = 0
    while (x != 0) {
      rem = x % 2;
      if (rem == 1) {
        selectedAccessCantrol.push(iter);
      }
      iter++;
      let num = x / 2;
      x = convertToInt(num);
      bin = bin + rem * i;
      i = i * 10;
    }
  }
  else {
    selectedAccessCantrol = []
  }
  return selectedAccessCantrol;
}

export function convertToInt(value) {
  return parseInt(value)
}

export function noWhitespaceValidator(control: FormControl) {
  const isWhitespace = (control.value || '').trim().length === 0;
  const isValid = !isWhitespace;
  return isValid ? null : { 'whitespace': true };
}


export async function handleIamge(url,fileUploadService,_sanitizer){
  let parserContent = s3ParseUrl(url);
  let resp = await fileUploadService.getContentFromS3Url(parserContent.key).promise();
  const LogoUrl = _sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + encode(resp?.Body));
  return LogoUrl ;
}
export async function handleIamgeCummertial(url, fileUploadService, _sanitizer) {
  let parserContent = s3ParseUrl(url);
  let resp = await fileUploadService.getContentFormCumertialS3Url(parserContent.key).promise();
  const LogoUrl = _sanitizer.bypassSecurityTrustUrl('data:image/jpg;base64,' + encode(resp?.Body));
  return LogoUrl;
} 

export function encode(data) {
  var str = data.reduce(function (a, b) { return a + String.fromCharCode(b) }, '');
  return btoa(str).replace(/.{76}(?=.)/g, '$&\n');
}

export function isImageType(file: any) {

  if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png') {
    return false;
  } else {
    return true;
  }
}
export function documentsType(file: any) {

  if (file.type == 'image/jpeg' || file.type == 'image/jpg' || file.type == 'image/png' || file.type == 'application/pdf') {
    return false;
  } else {
    return true;
  }
}
export function onlyNumber(str: string) {
  if (str && typeof str === 'string' && str.length > 0) {
    return str.replace(/[^0-9]/g, '');
  } else {
    return null;
  }
}
