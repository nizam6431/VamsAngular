import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contractor-pass-details',
  templateUrl: './contractor-pass-details.component.html',
  styleUrls: ['./contractor-pass-details.component.scss']
})
export class ContractorPassDetailsComponent implements OnInit {
  apntId: string = null;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.apntId = this.router.url.split("/")[3]
  }

}
