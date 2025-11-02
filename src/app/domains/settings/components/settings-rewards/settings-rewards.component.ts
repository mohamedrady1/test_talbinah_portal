import { EmptyStateCardComponent } from '../../../../shared/components/empty-state-card/empty-state-card.component';
import { ErrorStateCardComponent } from '../../../../shared/components/error-state-card/error-state-card.component';
import { SettingsRewardDetailsComponent } from '../settings-reward-details';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalService } from '../../../../shared/services/model.service';
import { RewardsFacade } from './../../services/rewards.facade';
import { AutoExactHeightDirective } from '../../../../common';
import { SvgIconComponent } from "../../../../shared";
import { CommonModule } from '@angular/common';
import { Logger } from '../../../../common';
import { getRemainingDays } from '../../../../shared/utils/date-format.util';
import { RewardsCoupon, RewardsAppointment, RewardItem } from '../../dtos';
import { TranslationsFacade } from '../../../../common/core/translations/services';
@Component({
  selector: 'app-settings-rewards',
  standalone: true,
  imports: [
    
    CommonModule,

    AutoExactHeightDirective,

    EmptyStateCardComponent,
    ErrorStateCardComponent,
    SvgIconComponent
  ],
  templateUrl: './settings-rewards.component.html',
  styleUrls: ['./settings-rewards.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsRewardsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  private readonly _modalService = inject(ModalService);
  private readonly _RewardsFacade = inject(RewardsFacade);

  protected readonly items = this._RewardsFacade.items;
  protected readonly isLoading = this._RewardsFacade.isLoading;
  protected readonly errorMessage = this._RewardsFacade.errorMessage;

  // State configurations
  protected readonly emptyStateConfig = {
    imageUrl: 'images/emptyStates/image-12.svg',
    title: 'no_rewards',
  };

  protected readonly errorStateConfig = {
    imageUrl: 'images/emptyStates/image-12.svg',
    title: this.errorMessage() || 'rewards_loading_error',
    onRetry: () => this.loadRewardsList()
  };

  ngOnInit(): void {
    this.loadRewardsList();
  }

  protected loadRewardsList(): void {
    this._RewardsFacade.fetchRewards();
  }

  protected onRetry(): void {
    this.loadRewardsList();
  }

  protected openRewardModal(reward: RewardItem): void {
    Logger.debug('SettingsRewardsComponent | openRewardModal | Reward Item', reward);
    this._modalService.open(SettingsRewardDetailsComponent, {
      inputs: {
        image: 'images/logos/icon.png',
        title: 'points_redemption',
        rewardItem: reward
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Reward Modal closed. Status:', data.status, 'Data:', data.data);
        }
      },
      width: "40%",
      isPhoneFromDown: true,
      maxHeight: "10rem",
      minHeight: "20rem",
      maxWidth: "50rem"
    });
  }

  // State methods
  protected readonly hasError = () => this.errorMessage() !== null;
  protected readonly isEmpty = () => this.items().length === 0;

  protected getRemainingDaysFn(targetDateStr?: string): number {
    if (!targetDateStr) return 0;
    return getRemainingDays(targetDateStr);
  }

  protected getRemainingDaysIfCoupon(
    gift: RewardsCoupon | RewardsAppointment | null | undefined
  ): number {
    if (gift && 'end_date' in gift) {
      return this.getRemainingDaysFn(gift.end_date);
    }
    return 0;
  }
}

