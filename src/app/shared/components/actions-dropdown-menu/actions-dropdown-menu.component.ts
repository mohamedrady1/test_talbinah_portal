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
import { ClickOutsideDirective } from '../../../common/core/directives';
import { TranslationsFacade } from '../../../common/core/translations/services';
import { IActionDropdownMenuItem } from '../../interfaces';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-actions-dropdown-menu',
  standalone: true,
  imports: [CommonModule, ClickOutsideDirective],
  templateUrl: './actions-dropdown-menu.component.html',
  styleUrls: ['./actions-dropdown-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ActionsDropdownMenuComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string {
    return this.translationsFacade.translate(key);
  }
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
