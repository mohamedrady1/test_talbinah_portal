import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-solid-success-btn',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './solid-success-btn.component.html',
  styleUrls: ['./solid-success-btn.component.scss']
})
export class SolidSuccessBtnComponent {
  @Input() label !: string;
  @Input() icon!: string;
  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}

