import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggle-button',
  templateUrl: './toggle-button.component.html',
  styleUrls: ['./toggle-button.component.css']
})
export class ToggleButtonComponent implements OnInit {
  toggleOptions: Array<String> = ["Active", "All"];
  isChecked: boolean = true;
  @Output() onToggle: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
    // this.onToggle.emit(this.active);
  }
  toggle(event) {
    this.isChecked = event.checked;
    this.onToggle.emit(event.checked);
  }
}
