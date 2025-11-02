import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-outline-gray-btn',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './outline-gray-btn.component.html',
  styleUrls: ['./outline-gray-btn.component.scss']
})
export class OutlineGrayBtnComponent {
  // Replace with configs [Interface] for the button
  @Input() label !: string;
  @Input() icon!: string;
  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}
