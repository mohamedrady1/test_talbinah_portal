import { Component, signal, computed, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Emoji } from '../../models';
import { EmojiCategory } from '../../../common/core/data-access/pagination/enums/emoji-data';
import { EMOJIS } from '../../data';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-emoji-picker',
  standalone: true,
  templateUrl: './emoji-picker.component.html',
  imports: [TranslateModule],
  styleUrls: ['./emoji-picker.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmojiPickerComponent {
  protected readonly categories = Object.values(EmojiCategory).map(category => ({
    key: category,
    text: `EmojiCategory.${category}`
  }));
  protected readonly activeCategory = signal<EmojiCategory>(EmojiCategory.Smileys);
  protected readonly search = signal('');
  protected readonly emojis = signal<Emoji[]>(EMOJIS);

  protected readonly filteredEmojis = computed(() => {
    const category = this.activeCategory();
    const searchTerm = this.search().toLowerCase();

    return this.emojis().filter(e =>
      e.category === category &&
      (e.name.toLowerCase().includes(searchTerm) || e.shortName.toLowerCase().includes(searchTerm))
    );
  });

  @Output() emojiSelected = new EventEmitter<string>();

  protected selectCategory(category: EmojiCategory) {
    this.activeCategory.set(category);
  }

  protected onSearch(value: string) {
    this.search.set(value);
  }

  protected getEmojiChar(unified: string): string {
    return String.fromCodePoint(...unified.split('-').map(u => parseInt(u, 16)));
  }

  protected emitEmoji(unified: string) {
    const emojiChar = this.getEmojiChar(unified);
    this.emojiSelected.emit(emojiChar);
  }
}
