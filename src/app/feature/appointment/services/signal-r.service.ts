import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr"// "@aspnet/signalr";  // or from "@microsoft/signalr" if you are using a new library
import moment from 'moment';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { API_CONFIG } from 'src/app/core/constants/rest-api.constants';
import { UserService } from 'src/app/core/services/user.service';
import { environment } from 'src/environments/environment';
import { Schedule } from '../models/appointment-schedule';

@Injectable({
  providedIn: 'root'
})
export class SignalRService {

  private restApi;

  constructor(
    private userService: UserService,
    private _http: HttpClient,
    @Inject(API_CONFIG) private endPoints: any) {
    this.restApi = endPoints;
  }
  
  private _hubConnectionId: BehaviorSubject<any>;
  private hubConnection: signalR.HubConnection | null = null;
  public hubConnectionId: Observable<any>;
  public appointmentData: EventEmitter<any> = new EventEmitter();
  connectionId: any;

  public async startConnection (){

    this._hubConnectionId = new BehaviorSubject<any>(null);
    this.hubConnection = null;
    this.hubConnectionId = this._hubConnectionId.asObservable();  
    this.appointmentData = new EventEmitter<string>();


    // https://vamsdev.com/VAMSCommercialApi/api/
    // https://api-dev.viraatlabs.com/VAMSCommercialApiDev
    // https://viraatlabs.com/VAMSCommercialApi/api

    let dynamicUrl = (environment.CompanyAPIURL).replace("/api","")+"signalRHub";
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(dynamicUrl, {transport: signalR.HttpTransportType.WebSockets | signalR.HttpTransportType.LongPolling })
      .build();

    this.hubConnection.start().then((data: any) => {
        if(this.hubConnection?.connectionId){
            this.setHubConnectionId(this.hubConnection?.connectionId);
        }
      }).catch(err => console.log('Error while starting connection: ' + err))

    this.hubConnection.serverTimeoutInMilliseconds = 8.64e+7;
    // console.log(this.hubConnection);
    // console.log(this.hubConnection.serverTimeoutInMilliseconds);
    this.hubConnection.onclose((error) => {
      // this.hubConnection.start();
      console.log("In",moment().format("DD-MM-YY HH:MM:SS A"));
      console.log(`Something went wrong: ${error}`);
  });
    
  }

  setHubConnectionId(id) {
    this._hubConnectionId.next(id);
  }
  public getBroadcastAppointmentData() {
    this.hubConnection!.on('broadcastAppointment', (data) => {
        this.appointmentData.emit(data);
    });
  }

  addSignalRConnection(connectionId: string,employeeId:number) {
    let addSignalRConnectionObject = {
      "connectionId": connectionId,
      "employeeId": employeeId
    }

    
  return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SIGNAL_R_CONNECTION_ADD, addSignalRConnectionObject)
    .pipe(map(data => {
      return data;
    }), catchError(error => {
      return error;
    }));
  }

  stopSignalR(){
    this.hubConnection.stop();
    console.log("*****************************************STOP*****************************");
  }

  deleteSignalRConnection(connectionId: string) :Observable<any>{
    let deleteSignalRConnectionObject = {
      "connectionId": connectionId
    }
    return this._http.post<any>(environment.CompanyAPIURL + this.restApi.SIGNAL_R_CONNECTION_DELETE, deleteSignalRConnectionObject)
      .pipe(map(data => {
        this.hubConnection.stop();
        this._hubConnectionId.unsubscribe();
        return data;
      }));
  }
}