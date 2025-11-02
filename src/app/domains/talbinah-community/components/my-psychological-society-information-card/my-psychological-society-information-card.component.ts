import { Component, EventEmitter, inject, Output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { IUserIdentifyProfileData } from '../../dtos';
import { Logger } from '../../../../common';
import { Router } from '@angular/router';
import { TalbinahCommunityRoutesEnum } from '../../constants';
import { UserIdentityStore } from '../../routes/user-identity.service';
import { ChooseYourMoodComponent } from '../../../mental-health-scales';

@Component({
  selector: 'app-my-psychological-society-information-card',
  standalone: true,
  imports: [TranslateModule, ChooseYourMoodComponent],
  templateUrl: './my-psychological-society-information-card.component.html',
  styleUrls: ['./my-psychological-society-information-card.component.scss']
})
export class MyPsychologicalSocietyInformationCardComponent {
  protected readonly userIdentityStore = inject(UserIdentityStore);
  userIdentityProfileData = this.userIdentityStore.profile;

  @Output() inputClicked = new EventEmitter<void>();
  private _Router = inject(Router);

  ngOnInit(): void {
    this.userIdentityStore.fetch();
    Logger.debug('Card Info => User Identity Profile Data: ', this.userIdentityProfileData());
  }

  selectedMood = signal<{ id: number; icon: string; label: string } | null>(null);

  protected selectMood(mood: { id: number; icon: string; label: string }) {
    this.selectedMood.set(mood);
    console.log('Selected mood ID:', mood.id);
  }

  protected onInputClick(): void {
    this.inputClicked.emit();
  }

  protected goToProfile(id: number): void {
    this._Router.navigate([
      TalbinahCommunityRoutesEnum.TALBINAH_COMMUNITY_MAIN_PAGE + '/' + TalbinahCommunityRoutesEnum.USER_COMMUNITY_PROFILE,
      id,
    ]);
  }
}
