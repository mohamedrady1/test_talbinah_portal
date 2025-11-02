import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CardType, LanguageService } from '../../../../common';
import { ISeminarItemDto } from '../../../../domains';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes';

@Component({
  selector: 'app-group-card',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    TranslateApiPipe
  ],
  templateUrl: './group-card.component.html',
  styleUrls: ['./group-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupCardComponent {
  protected cardType = CardType;
  @Input() type: CardType = CardType.SUMMARY;

  @Input() item!: ISeminarItemDto;

  protected readonly languageService = inject(LanguageService);
  protected readonly currentLang = this.languageService.getCurrentLanguage();

  @Output() onClick = new EventEmitter<void>();
  @Input() config: any = {
    title: 'كيفية التعامل مع نوبات الهلع ؟',
    type: CardType.SUMMARY,
    cost: 80,
    details: 'سنأخذك في رحلة مع الاخصائية أروي .. لفهم نوبات الهلع مع جذورها، وكيفية التعامل معها بثقة وهدوء. سنتعرف علي الأسباب والمحفزات الشائعة، ونكسر المعتقدات الخاطئة المرتبطة بها .',
    doctor: 'د. احمد حسام',
    date: '30 أبريل - الاربعاء',
    time: '7:00'
  }
  protected onCardClick(): void {
    this.onClick.emit();
  }
}
