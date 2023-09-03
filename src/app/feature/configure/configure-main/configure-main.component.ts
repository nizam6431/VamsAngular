import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-configure-main',
  templateUrl: './configure-main.component.html',
  styleUrls: ['./configure-main.component.scss']
})
export class ConfigureMainComponent implements OnInit {
  type: string = "email_server_config";

  constructor() { }

  ngOnInit(): void {
  }

  sideBarMenu(type){
    this.type = type;
  }

}
