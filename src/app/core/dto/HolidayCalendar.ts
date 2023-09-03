export class HolidayCalendar {
        Data: Datum[] = [];
    }

    export class Datum {
        HolidayId: number;
        CompanyId: number;
        LocationId: number;
        Name: string;
        HolidayDate: Date;
        Deleted: boolean;
        ModifiedBy: string;
        ModifiedDate: Date;
        ModifiedDateUtc: Date;
        Language?: any;
    }
