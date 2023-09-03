import { Component, OnInit } from '@angular/core';
import { Constants } from '../../master/constants/columns';


const ELEMENT_DATA = [
  {"name": 'Hydrogen', "mobile": 1.0079, "email": 'H', "idProof": 'license', "comapny": 'Test'},
  {"name": 'Hydrogen', "mobile": 1.0079, "email": 'H', "idProof": 'license', "comapny": 'Test'},
  {"name": 'Hydrogen', "mobile": 1.0079, "email": 'H', "idProof": 'license', "comapny": 'Test'},
  {"name": 'Hydrogen', "mobile": 1.0079, "email": 'H', "idProof": 'license', "comapny": 'Test'},
];

@Component({
  selector: 'app-contractor',
  templateUrl: './contractor.component.html',
  styleUrls: ['./contractor.component.css']
})
export class ContractorComponent implements OnInit {

  constructor() { }
  displayedColumns: any []=  Constants.contractor_visitor_column;
  dataSource: any = ELEMENT_DATA;

  ngOnInit(): void {
  }

}
