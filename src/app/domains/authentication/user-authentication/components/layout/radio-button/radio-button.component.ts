import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RadioButtonConfig } from './interface/radio-button-model';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-radio-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './radio-button.component.html',
  styleUrls: ['./radio-button.component.scss']
})
export class RadioButtonComponent {
  @Input() config: RadioButtonConfig | undefined;
  @Output() selectedValue: EventEmitter<string> = new EventEmitter<string>();

  onSelect(value: string | undefined) {
    this.selectedValue.emit(value);
  }
}
