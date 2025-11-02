import { Component, Input, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Reaction, REACTION_TYPES, ReelReactionType } from '../../models';
import { ReactionPickerComponent } from '../../../../shared';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-reel-actions',
  standalone: true,
  imports: [CommonModule, ReactionPickerComponent, TranslateModule],
  templateUrl: './reel-actions.component.html',
  styleUrls: ['./reel-actions.component.scss']
})
export class ReelActionsComponent {
  @Input() initialCommentsCount: number = 0; // Input for initial comments count

  selectedReactionType = signal<ReelReactionType>(ReelReactionType.None);
  showPicker = signal(false); // Controls visibility of ReactionPickerComponent

  // Available reactions based on your model
  availableReactions: Reaction[] = REACTION_TYPES;

  // Computed signal to get the details of the currently selected reaction
  selectedReaction = computed(() => {
    const type = this.selectedReactionType();
    return type === ReelReactionType.None ? null : this.availableReactions.find(r => r.id === type);
  });

  // Called when a reaction is selected from the picker
  onReactionSelected(type: ReelReactionType): void {
    if (this.selectedReactionType() === type) {
      // If same reaction is clicked again, deselect it
      this.selectedReactionType.set(ReelReactionType.None);
    } else {
      this.selectedReactionType.set(type);
    }
    this.showPicker.set(false); // Hide picker after selection
    // Here you would typically send this reaction to your backend
    console.log('Reaction selected:', type);
  }

  // Toggles "like" if no reaction is selected, otherwise does nothing (picker handles selection)
  toggleLike(): void {
    if (this.selectedReactionType() === ReelReactionType.None) {
      this.selectedReactionType.set(ReelReactionType.Like);
      console.log('Default like toggled.');
    }
    // If a reaction is already selected, clicking the icon does nothing unless it's the picker itself
    // Or you can add logic here to deselect any reaction on click
  }
}