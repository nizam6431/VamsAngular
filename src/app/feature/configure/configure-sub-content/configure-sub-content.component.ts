import { Component, OnInit, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-configure-sub-content',
  templateUrl: './configure-sub-content.component.html',
  styleUrls: ['./configure-sub-content.component.scss']
})
export class ConfigureSubContentComponent implements OnInit {
  hsqQuestionAdd = null;
  @Input() hsqQuestionAddEvent;
  @Input() type: string;
  @Output() modeEmmiter = new EventEmitter();



  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.hsqQuestionAddEvent) {
      this.hsqQuestionAdd = new Date().getTime();

    }
  }

  // checkSetting(type) {
  //   switch (type) {
  //     case 'email_server_config':
  //       this.title = this.translate.instant("Configure.email_server_config");
  //       break;
  //     case 'sms_server_config':
  //       this.title = this.translate.instant("Configure.sms_server_config");
  //       break;
  //   }
  // }

}
