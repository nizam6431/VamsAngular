import { Component, OnInit } from "@angular/core";
import { Constants } from "../constants/columns";
@Component({
  selector: "app-complex",
  templateUrl: "./complex.component.html",
  styleUrls: ["./complex.component.scss"],
})
export class ComplexComponent implements OnInit {
  displayedColumns: any[] = Constants.company_column;
  dataSource: any;
  type: string = "complex";

  constructor() {}

  ngOnInit(): void {}
}
