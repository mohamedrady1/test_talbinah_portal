import { CommonModule } from '@angular/common';
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { IStoryCard } from '../../models';
import { LazyLoadImageDirective } from '../../../../common/core/directives/lazyloading/lazy-load-image.directive';

@Component({
  selector: 'app-story-slider-card',
  standalone: true, // Mark as standalone
  imports: [CommonModule, LazyLoadImageDirective],
  templateUrl: './story-slider-card.component.html',
  styleUrls: ['./story-slider-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Optimize change detection
})
export class StorySliderCardComponent {
  // Strongly type the input config
  @Input({ required: true }) public config!: IStoryCard; // Mark as required for better type safety
  // Remove cardWidth input if not dynamically set per card; let SCSS handle it or pass via config
  @Input() public cardWidth!: number; // Keeping for now based on previous usage, but re-evaluate

  /**
   * Handles the click event on the story card.
   * This is a protected method for template access.
   */
  protected storyDetails(): void {
    // In a real application, you'd navigate or emit an event here
    console.log('Story card clicked:', this.config.title);
    // Example: this.router.navigate([this.config.link]);
  }
}
