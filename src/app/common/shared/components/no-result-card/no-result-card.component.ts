import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SolidBtnComponent } from "../buttons/solid-btn/solid-btn.component";
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-no-result-card',
  standalone: true,
  imports: [SolidBtnComponent, TranslateModule],
  templateUrl: './no-result-card.component.html',
  styleUrls: ['./no-result-card.component.scss']
})
export class NoResultCardComponent {
  @Input() title!: string;
  @Input() label!: string;
  @Output() click = new EventEmitter<void>();

  onClick() {
    this.click.emit();
  }
}
