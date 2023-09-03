import { Address } from "./complex-details";

export interface Data {
    level2Id: string;
    name: string;
    status: string;
    address: Address;
}

export interface BuildingObject {
    statusCode: number;
    message?: any;
    data: Data;
    errors?: any;
}
