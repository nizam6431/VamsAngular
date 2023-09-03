import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { settingSequance, settingsideBarMenu } from '../constant/side-setting-menu';

@Component({
  selector: 'app-setting-side-bar',
  templateUrl: './setting-side-bar.component.html',
  styleUrls: ['./setting-side-bar.component.scss']
})
export class SettingSideBarComponent implements OnInit {
  @Output() fromSideBar =  new EventEmitter()
  sideBarMenu:any[]=[];
  selectedIndex: number;
  productType: any;
  ProductType = ProductTypes;
  constructor( private userService: UserService) {
     this.productType = this.userService.getProductType();
   }

  ngOnInit(): void {
    settingSequance.forEach((element) => {
      // remove this condition when you want to show "general setting" in side bar menu
      if (element == 'General' || element =='ProviderMaster') {
         
      }
      else if ( this.productType == this.ProductType.Enterprise && (element =='ProviderMaster' ||  element =='Notification') ) {
        
      }
      else {
        this.sideBarMenu.push(settingsideBarMenu[element]);
      }
    })
    this.goToMenu(this.sideBarMenu[0].key,0)
  }
  

  goToMenu(menu,index:number){
    this.fromSideBar.emit(menu)
    this.selectedIndex = index;
  }
}
