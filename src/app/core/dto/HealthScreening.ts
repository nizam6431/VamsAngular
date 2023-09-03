export class HealthScreening {
    Data: Data[] = [];
}

export class Data {
    HSQId: number;
    CompanyId: number;
    LocationId: number;
    Language: string;
    PersonaId: number;
    Question: string;
    Answer: string;
    Deleted: boolean;
}


