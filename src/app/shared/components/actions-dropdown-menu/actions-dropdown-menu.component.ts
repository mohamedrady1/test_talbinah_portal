import {
  Component,
  Input,
  Output,
  EventEmitter,
  inject,
  PLATFORM_ID,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ClickOutsideDirective } from '../../../common/core/directives';
import { TranslateModule } from '@ngx-translate/core';
import { IActionDropdownMenuItem } from '../../interfaces';
import { TranslateApiPipe } from '../../../common/core/translations';
@Component({
  selector: 'app-actions-dropdown-menu',
  standalone: true,
  imports: [CommonModule, TranslateModule, ClickOutsideDirective, TranslateApiPipe],
  templateUrl: './actions-dropdown-menu.component.html',
  styleUrls: ['./actions-dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsDropdownMenuComponent {
  @Input() menuItems: IActionDropdownMenuItem[] = [];
  @Input() isArrow: boolean = false;
  @Output() itemClicked = new EventEmitter<IActionDropdownMenuItem>();
  protected onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'images/icons/details.png';
  }

  protected openMenu = signal(false);

  constructor() { }

  protected toggleMenu(): void {
    this.openMenu.update((val) => !val);
  }

  protected closeMenu(): void {
    this.openMenu.set(false);
  }

  protected onMenuItemClick(item: IActionDropdownMenuItem, event?: MouseEvent): void {
    if (item.isOpenModal) {
      this.closeMenu();
    }
    this.itemClicked.emit(item);
    event?.stopPropagation(); // prevent toggleMenu() from firing again
  }

}
