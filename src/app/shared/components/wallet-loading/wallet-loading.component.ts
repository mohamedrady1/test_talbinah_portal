import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-wallet-loading',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './wallet-loading.component.html',
  styleUrls: ['./wallet-loading.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WalletLoadingComponent {
  // Array for generating loading cards
  readonly loadingCards = Array.from({ length: 3 }, (_, i) => i + 1);
} 