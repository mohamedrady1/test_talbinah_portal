import { AccordionItem, DynamicAccordionItemComponent } from '../../../../shared';
import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { MentalStateHeader } from '../../constants';

@Component({
  selector: 'app-mental-state',
  standalone: true,
  imports: [
    DynamicAccordionItemComponent,
    TranslateModule
  ],
  templateUrl: './mental-state.component.html',
  styleUrls: ['./mental-state.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MentalStateComponent {
  readonly item: AccordionItem = MentalStateHeader;

  readonly isOpen = signal<boolean>(false);
}
