import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/internal/operators/filter';
import { first, timeout } from 'rxjs/operators';
import { AppointmentService } from 'src/app/feature/appointment/services/appointment.service';
import { SignalRService } from 'src/app/feature/appointment/services/signal-r.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-main-container',
  templateUrl: './main-container.component.html',
  styleUrls: ['./main-container.component.scss']
})
export class MainContainerComponent implements OnInit, OnDestroy {
  connectionId: any;
  userDetails: any;
  signalRSubscription: any;
  addSignalR: boolean;
  deleteSignalR: boolean;
  previousUrl: string;
  // @HostListener('window:beforeunload', ['$event'])
  // beforeunloadHandler(event): void {
  //   event.preventDefault();
  //   this.deleteSignalRConnection();  
  // }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.signalRService.stopSignalR();
    this.deleteSignalRConnection();
  }

  constructor(
    private userService: UserService,
    public signalRService: SignalRService,
    private appointmentService: AppointmentService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    // window.addEventListener("beforeunload", (event) => {
    //   // event.preventDefault();
    //   // event.returnValue = "Unsaved modifications";
    
    //   this.deleteSignalRConnection();  
    //   return event;
    // });
    this.userDetails = this.userService.getUserData();
    // router.events.pipe(filter(event => event instanceof NavigationEnd))
    // .subscribe((event: NavigationEnd) => {
    //     if (event && event.url && event.url === '/appointments'){
    //       this.signalRImplementation();
    //     }
    //     else {
    //       this.deleteSignalRConnection();
    //     }
    // });

    // router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd ) {
    //     console.log(this.previousUrl,event.url)
    //     if (event && event.url && event.url === '/appointments' && this.previousUrl != event.url){
    //       this.signalRImplementation();
    //     }
    //     else {
    //       this.deleteSignalRConnection();
    //     }    
    //     this.previousUrl = event.url;  
    //   }
    // });
    this.signalRImplementation();
  }

  ngOnInit(): void {
    // window.onbeforeunload = (ev) =>{
    //   console.log(ev);
    //   this.deleteSignalRConnection();
    // }
  }

  async signalRImplementation() {
    if (this.connectionId == null) {
      await this.signalRService.startConnection();
      this.signalRSubscription = this.signalRService.hubConnectionId.subscribe(id => {
        this.connectionId = id;
        if (this.connectionId) {
          this.signalRService.addSignalRConnection(this.connectionId, this.userDetails.employeeId).subscribe(data => {
            this.addSignalR = true;
            this.deleteSignalR = false;
            this.signalRService.getBroadcastAppointmentData();
          });
        }
      })
    }
  }

  deleteSignalRConnection() {
    if (this.connectionId != null) {
      this.signalRService.deleteSignalRConnection(this.connectionId)
        .pipe(first())
        .subscribe(data => {
          this.signalRService.getBroadcastAppointmentData();
          this.connectionId = null;
          this.signalRSubscription.unsubscribe();
          this.deleteSignalR = true;
          this.addSignalR = false;
        }, (error) => {
          this.connectionId = null;
        });
    }
  }

  ngOnDestroy() {
    // if (this.connectionId != null)
    //   this.deleteSignalRConnection()
  }

}
