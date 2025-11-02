import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface LoadingShimmerConfig {
  type: 'card' | 'list' | 'grid';
  count?: number;
  height?: string;
  width?: string;
  borderRadius?: string;
}

@Component({
  selector: 'app-loading-shimmer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-shimmer.component.html',
  styleUrls: ['./loading-shimmer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingShimmerComponent {
  @Input() config: LoadingShimmerConfig = {
    type: 'card',
    count: 6,
    height: '200px',
    width: '100%',
    borderRadius: '0.75rem'
  };

  get shimmerItems(): number[] {
    return Array.from({ length: this.config.count || 6 }, (_, i) => i);
  }
} 