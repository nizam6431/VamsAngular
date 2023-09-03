import { Component, OnInit } from '@angular/core';
import { Constants } from "../constants/columns";
@Component({
  selector: 'app-hospital',
  templateUrl: './hospital.component.html',
  styleUrls: ['./hospital.component.scss']
})
export class HospitalComponent implements OnInit {
  displayedColumns: any[] = Constants.company_column;
  dataSource: any;
  type: string = "hospital";
  constructor() { }

  ngOnInit(): void {
  }

}
