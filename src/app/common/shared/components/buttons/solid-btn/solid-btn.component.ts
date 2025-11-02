import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
// import { ButtonConfigEnum, IButtonConfig } from '../../../../core';

@Component({
  selector: 'app-solid-btn',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './solid-btn.component.html',
  styleUrls: ['./solid-btn.component.scss']
})
export class SolidBtnComponent {
  // Replace with configs [Interface] for the button
  // config: IButtonConfig = {
  //   id: 'solid-btn',
  //   label: 'Solid Button',
  //   icon: 'icon-name',
  //   type: ButtonConfigEnum.Type.Solid,
  //   color: ButtonConfigEnum.Color.Main,
  //   size: ButtonConfigEnum.Size.Medium,
  //   iconPosition: ButtonConfigEnum.IconPosition.Left,
  //   iconSize: ButtonConfigEnum.IconSize.Medium,
  //   iconColor: ButtonConfigEnum.IconColor.Main,
  //   iconType: ButtonConfigEnum.IconType.Solid,
  //   iconWeight: ButtonConfigEnum.IconWeight.Regular,
  //   iconStyle: ButtonConfigEnum.IconStyle.Outline,
  // };
  @Input() label !: string;
  @Input() icon!: string;
  @Output() action = new EventEmitter<void>();

  onClick() {
    this.action.emit();
  }
}
