import { Component, inject, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { EmptyStateComponent, ErrorStateComponent, ErrorStateConfig, ToastService } from '../../../../shared';
import { AvatarsEmptyState, IdentityFormFacade, InterestsEmptyState } from '../../../../domains';
import { getAvatarsError, getInterestsError } from '../../configs';
import { IEmojiItem, IPostInterest } from '../../dtos';
import { Logger } from '../../../../common';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-talbinah-identity-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslateModule,
    CommonModule,
    ErrorStateComponent,
    EmptyStateComponent,
    TranslateApiPipe
  ],
  templateUrl: './talbinah-identity-form.component.html',
  styleUrls: ['./talbinah-identity-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TalbinahIdentityFormComponent {
  private readonly fb = inject(FormBuilder);
  protected readonly _IdentityFormFacade = inject(IdentityFormFacade);
  private readonly toastService = inject(ToastService);

  protected readonly avatarsEmptyState = AvatarsEmptyState;
  protected readonly interestsEmptyState = InterestsEmptyState;

  protected formGroup: FormGroup;
  protected emojiError = signal(false);
  protected interestsError = signal(false);
  protected selectedEmoji = signal<IEmojiItem | null>(null);
  protected selectedInterests = signal<IPostInterest[]>([]);
  protected isSubmittingWithShimmer = signal(false);

  protected interestsErrorState: ErrorStateConfig = getInterestsError(() => this._IdentityFormFacade.fetchInterests());
  protected avatarsErrorState: ErrorStateConfig = getAvatarsError(() => this._IdentityFormFacade.fetchEmojis());

  constructor() {
    this.formGroup = this.fb.group({
      defaultName: ['', Validators.required]
    });

    this._IdentityFormFacade.fetchEmojis();
    this._IdentityFormFacade.fetchInterests();

    // Use untracked to prevent circular dependencies
    effect(() => {
      const isLoading = this._IdentityFormFacade.isLoadingSubmit();
      const error = this._IdentityFormFacade.submitError();

      Logger.debug('[TalbinahIdentityFormComponent] | State update:', { isLoading, error });

      if (error) {
        Logger.error('[TalbinahIdentityFormComponent] | Submission error:', error);
        // Handle error display if needed
      }
    });
  }

  protected isAllInterestsSelected(): boolean {
    const all = this._IdentityFormFacade.interests();
    const selected = this.selectedInterests();
    return all.length > 0 && selected.length === all.length;
  }

  protected toggleSelectAllInterests(): void {
    const all = this._IdentityFormFacade.interests();
    const currentlySelected = this.selectedInterests();

    if (currentlySelected.length === all.length) {
      this.selectedInterests.set([]);
    } else {
      this.selectedInterests.set([...all]);
      this.interestsError.set(false);
    }
  }

  protected selectEmoji(emoji: IEmojiItem): void {
    this.selectedEmoji.set(emoji);
    this.emojiError.set(false);
  }

  protected toggleInterest(interest: IPostInterest): void {
    const current = this.selectedInterests();
    const index = current.findIndex(i => i.id === interest.id);

    if (index === -1) {
      this.selectedInterests.set([...current, interest]);
    } else {
      this.selectedInterests.set(current.filter(i => i.id !== interest.id));
    }

    if (this.selectedInterests().length > 0) {
      this.interestsError.set(false);
    }
  }

  protected isInterestSelected(interest: IPostInterest): boolean {
    return this.selectedInterests().some(i => i.id === interest.id);
  }

  public onSubmit(): void {
    // Validate form
    const isFormValid = this.formGroup.valid;
    const isEmojiSelected = !!this.selectedEmoji();
    const hasInterests = this.selectedInterests().length > 0;

    this.emojiError.set(!isEmojiSelected);
    this.interestsError.set(!hasInterests);

    if (!isFormValid || !isEmojiSelected || !hasInterests) {
      this.formGroup.markAllAsTouched();
      return;
    }

    // Prepare payload
    const payload = {
      dummy_name: this.formGroup.value.defaultName,
      emoji_id: this.selectedEmoji()!.id,
      interest_id: JSON.stringify(this.selectedInterests().map(i => i.id))
    };

    Logger.debug('TalbinahIdentityFormComponent | onSubmit | payload:', payload);

    // Submit the form
    this._IdentityFormFacade.submitIdentity(payload);
  }

}
