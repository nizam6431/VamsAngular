import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ProductTypes } from 'src/app/core/models/app-common-enum';
import { UserService } from 'src/app/core/services/user.service';
import { sequenceOfMenu, sideBarMenu } from '../constants/side-menu'

@Component({
  selector: 'app-configure-sidebar',
  templateUrl: './configure-sidebar.component.html',
  styleUrls: ['./configure-sidebar.component.scss']
})
export class ConfigureSidebarComponent implements OnInit {
  @Output() fromSideBar = new EventEmitter()
  sideBarMenu: any[] = [];
  selectedIndex: number;
  isL1Admin: boolean;
  ProductType = ProductTypes;
  productType: string;
  SeepzWorkFlow:any;
  constructor(
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.isL1Admin = this.userService.isLevel1Admin();
    this.productType = this.userService.getProductType();
    this.SeepzWorkFlow = this.userService.getWorkFlow();

     // for commercial and interprise menu's

    sequenceOfMenu.forEach((element) => {
      // if (element == "HsqScreeningQuestionnaire") {
        // if (this.isL1Admin) {
        //   this.sideBarMenu.push(sideBarMenu[element]);
        // }
      // }
       if ((element =='NDA' || element == 'ContactorConfigFields') && this.productType == this.ProductType.Commercial) {
        //  this.sideBarMenu.push(sideBarMenu[element]);
      }
      else if ((element =='ProviderSetup') && this.productType == this.ProductType.Enterprise) {
        //  this.sideBarMenu.push(sideBarMenu[element]);
      }
      else if((element !='EmailServerConfig' && element !='RateCard'  && element != 'BannerImage' && element != 'TermsAndCondition' && element != 'PrivacyAndPolicy')  && this.SeepzWorkFlow == this.SeepzWorkFlow ){
      }
      else {
        this.sideBarMenu.push(sideBarMenu[element]);
      }
    })
    this.goToMenu(this.sideBarMenu[0].key, 0)

  }

  goToMenu(menu, index: number) {
    this.fromSideBar.emit(menu);
    this.selectedIndex = index;
  }
}
