import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicFormComponent, IFormInputConfig } from '../../../../shared';
import { addNewSubscriptionCardForm } from '../../configs';

@Component({
  selector: 'app-add-new-subscription-card',
  standalone: true,
  imports: [TranslateModule, DynamicFormComponent],
  templateUrl: './add-new-subscription-card.component.html',
  styleUrls: ['./add-new-subscription-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddNewSubscriptionCardComponent {
  formConfigs: IFormInputConfig[] = [];
  itemsFormValidationEmit: boolean = false;
  @Output() goBack = new EventEmitter<void>();
  @Output() onConfirm = new EventEmitter<void>();
  ngOnInit() {
    this.initializeForm();
  }
  // 💡 Start Form Functions
  private initializeForm(): void {
    this.formConfigs = addNewSubscriptionCardForm;
  }
  protected emitValidation(): void {
    this.itemsFormValidationEmit = !this.itemsFormValidationEmit;
  }
  protected emitGoBack(): void {
    this.goBack.emit();
  }
  protected emitOnConfirm(): void {
    this.onConfirm.emit();
  }
}
