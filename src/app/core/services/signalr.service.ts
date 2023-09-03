import { HttpClient } from "@angular/common/http";
import { EventEmitter, Injectable } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { first } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AccountService } from "./account.service";


declare var $: any;
@Injectable({ providedIn: 'root' })
export class SignalRService {
    // Declare the variables  
    private proxy: any;
    private proxyName: string = 'SignalRHub';
    private connection: any;
    // create the Event Emitter  
    public messageReceived: EventEmitter<any>;
    public connectionEstablished: EventEmitter<string>;
    public connectionExists: Boolean;
    constructor(private authenticationService: AccountService,
        private _http: HttpClient,
        private translate: TranslateService) {
    }

    // public initializeSignalR() {
    //     this.connectionEstablished = new EventEmitter<string>();
    //     this.messageReceived = new EventEmitter<string>();
    //     this.connectionExists = false;
    //     this.connection = $.hubConnection(environment.CompanyAPIURL);
    //     this.proxy = this.connection.createHubProxy(this.proxyName);
    //     this.registerOnServerEvents();
    //     this.startConnection();
    // }

    // private startConnection(): void {
    //     this.connection.start({ jsonp: true }).done((data: any) => {
    //         var signalRDetails = {
    //             ConnectionId: data.id,
    //             CompanyId: environment.CompanyId,
    //             LocationId: JSON.parse(localStorage.getItem("currentLocation")!).LocationId,
    //             UserId: this.authenticationService.currentUserValue.UserId,
    //             Language: this.translate.currentLang,
    //         }
    //         this._http.post<any>(environment.CompanyAPIURL + 'SignalRCrud/SaveSignalR', signalRDetails).pipe(first())
    //             .subscribe(
    //                 (dataObj: any) => {
    //                     this.connectionEstablished.emit(data.id);
    //                     this.connectionExists = true;
    //                 }, (error: any) => {
    //                 });
    //     }).fail((error: any) => {
    //         this.connectionEstablished.emit("");
    //     });
    // }

    private registerOnServerEvents(): void {
        this.proxy.on('broadcastAppointment', (data: any) => {
            this.messageReceived.emit(data);
        });
    }

    DeleteSignalRConnection(connectionId: any) {
        var signalRDetails = {
            ConnectionId: connectionId,
            Language: this.translate.currentLang
        }
        return this._http.post<any>(environment.CompanyAPIURL + 'SignalRCrud/DeleteSignalR', signalRDetails);
    }
}