import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-outline-main-btn',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './outline-main-btn.component.html',
  styleUrls: ['./outline-main-btn.component.scss']
})
export class OutlineMainBtnComponent {
  // Replace with configs [Interface] for the button
  @Input() label !: string;
  @Input() icon!: string;
  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}
