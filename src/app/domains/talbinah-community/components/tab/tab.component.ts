import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';

export interface Tab {
  id: number;
  text: string;
  active?: boolean;
}

@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class tabComponent {
  @Input() tab!: Tab;
  @Output() clicked = new EventEmitter<number>();

  active = signal(false);

  onClick(): void {
    this.clicked.emit(this.tab.id);
  }
}
