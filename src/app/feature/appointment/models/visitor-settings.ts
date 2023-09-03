export interface Data {
    isNoAuth: boolean;
    isByPass: boolean;
    isPrintPass: boolean;
    isWalkin: boolean;
    isNDACheck: boolean;
    isHostRequired: boolean;
    isAuthAlways: boolean;
    isCamera: boolean;
    isLivePhoto: boolean;
    isVisitorHSQ: boolean;
    isNoTouchAllowed: boolean;
    timeZone: string;
    dateFormat: string;
    languageCode: string;
    timeformat: number;
}

export interface VisitorSetting {
    statusCode: number;
    message?: any;
    data: Data;
    errors?: any;
} 