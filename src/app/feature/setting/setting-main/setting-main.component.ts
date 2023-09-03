import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setting-main',
  templateUrl: './setting-main.component.html',
  styleUrls: ['./setting-main.component.scss']
})
export class SettingMainComponent implements OnInit {
  type: string='appoinement_setting';

  constructor() { }

  ngOnInit(): void {
  }

  sideBarMenu(type){
    this.type = type;
  }
}
