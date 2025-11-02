import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-solid-danger-btn',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './solid-danger-btn.component.html',
  styleUrls: ['./solid-danger-btn.component.scss']
})
export class SolidDangerBtnComponent {
  @Input() label !: string;
  @Input() icon!: string;
  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}

