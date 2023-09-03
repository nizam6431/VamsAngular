import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-hsq-success',
  templateUrl: './hsq-success.component.html',
  styleUrls: ['./hsq-success.component.css']
})
export class HsqSuccessComponent implements OnInit {

  constructor( private titleService: Title) {

    this.titleService.setTitle("Health Screening Questionnaire");
   }

  ngOnInit(): void {
  }

}
