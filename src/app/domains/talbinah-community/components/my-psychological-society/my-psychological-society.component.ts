import { ChangeDetectionStrategy, Component, ViewChild, HostListener, signal, computed, PLATFORM_ID, inject } from '@angular/core';
import { TalbinahIdentityFormComponent } from '../talbinah-identity-form';
import { WelcomeToTalbinahComponent } from '../welcome-to-talbinah';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IdentityFormFacade } from '../../services';
import { SvgIconComponent } from "../../../../shared";

@Component({
  selector: 'app-my-psychological-society',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule,
    TalbinahIdentityFormComponent,
    WelcomeToTalbinahComponent,
    SvgIconComponent
  ],
  templateUrl: './my-psychological-society.component.html',
  styleUrls: ['./my-psychological-society.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyPsychologicalSocietyComponent {
  @ViewChild(TalbinahIdentityFormComponent)
  identityFormComponent!: TalbinahIdentityFormComponent;

  private readonly platformId = inject(PLATFORM_ID);
  protected readonly _IdentityFormFacade = inject(IdentityFormFacade);

  protected screenWidth = signal<number>(0);
  protected showIdentityForm = signal<boolean>(true);
  protected readonly isBelow1000 = computed(() => this.isBrowser() && this.screenWidth() < 1000);

  constructor() {
    if (this.isBrowser()) {
      this.screenWidth.set(window.innerWidth);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (this.isBrowser()) {
      this.screenWidth.set(window.innerWidth);
    }
  }

  protected isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  protected toggleFormVisibility(): void {
    this.showIdentityForm.update(current => !current);
  }

  protected onSubmit(): void {
    if (this.identityFormComponent) {
      this.identityFormComponent.onSubmit();
    }
  }
}
