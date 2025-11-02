import { Component, Input, ContentChild, TemplateRef, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionItem } from '../../models';
import { Logger } from '../../../common';
import { signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../common/core/translations/services';

@Component({
  selector: 'app-dynamic-accordion-item',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
  ],
  templateUrl: './dynamic-accordion-item.component.html',
  styleUrls: ['./dynamic-accordion-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DynamicAccordionItemComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
  @Input({ required: true }) set item(value: AccordionItem) {
    this.itemSignal.set({ ...value, isOpen: value.isOpen ?? false });
  }
  @ContentChild(TemplateRef) customContent?: TemplateRef<any>;

  // Initialize with a default AccordionItem to avoid null
  private readonly itemSignal = signal<AccordionItem>({
    id: '',
    title: '',
    isOpen: false,
    reaction: '',
    username: '',
    content: ''
  });

  ngOnInit(): void {
    Logger.debug('Item: ', this.itemSignal());
    this.itemSignal.update(item => ({
      ...item,
      isOpen: item.isOpen ?? false
    }));
  }

  toggleItem(): void {
    this.itemSignal.update(currentItem => ({
      ...currentItem,
      isOpen: !currentItem.isOpen
    }));
  }

  get itemValue(): AccordionItem {
    return this.itemSignal();
  }
}
