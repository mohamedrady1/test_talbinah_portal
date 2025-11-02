import { ChangeDetectionStrategy, Component, inject, signal, computed, Input, PLATFORM_ID } from '@angular/core';
import { GovernmentAgencyVerificationComponent } from '../government-agency-verification';
import { EmptyStateCardComponent, ErrorStateCardComponent, ModalService, SvgIconComponent } from '../../../../shared';
import { GovernmentAgenciesFacade } from '../../services';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { IGovernmentAgencyItemdDto, ISettingMenuItem } from '../../dtos';
import { FormsModule } from '@angular/forms';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { governmentAgenciesEmptyConfig, governmentAgenciesErrorConfig } from '../../configs';
import { Router } from '@angular/router';
import { TranslateApiPipe } from '../../../../common/core/translations';

@Component({
  selector: 'app-government-agencies',
  standalone: true,
  imports: [
    SvgIconComponent,
    CommonModule,
    FormsModule,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    AutoExactHeightDirective,
    TranslateApiPipe
  ],
  templateUrl: './government-agencies.component.html',
  styleUrls: ['./government-agencies.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GovernmentAgenciesComponent {
  @Input() config!: ISettingMenuItem;
  private readonly _modalService = inject(ModalService);
  private readonly _router = inject(Router);
  private readonly _isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  private readonly facade = inject(GovernmentAgenciesFacade);

  readonly isLoading = this.facade.isLoading;
  readonly errorMessage = this.facade.errorMessage;
  readonly allAgencies = this.facade.agencies;

  readonly searchQuery = signal('');
  readonly filteredAgencies = computed(() => {
    const term = this.searchQuery().toLowerCase();
    return this.allAgencies().filter(a => a.name?.toLowerCase().includes(term));
  });

  protected emptyState = governmentAgenciesEmptyConfig;
  protected errorState = governmentAgenciesErrorConfig(() => this.facade.fetchAgencies());

  onSearch(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }

  ngOnInit(): void {
    this.facade.fetchAgencies();
    // this.openGovernmentAgencyVerificationModal(this.allAgencies()[0]);
  }

  protected openGovernmentAgencyVerificationModal(item: IGovernmentAgencyItemdDto): void {
    this._modalService.open(GovernmentAgencyVerificationComponent, {
      inputs: {
        image: 'images/settings/modal-icons/government-agencies.png',
        title: 'verify_email',
        // subtitle: 'link_government_account',
        config: item
      },
      outputs: {
        closed: (data: { status: boolean, data: any }) => {
          Logger.debug('Government Agency Modal closed. Status:', data?.status, 'Data:', data?.data);
        }
      },
      width: "25%"
    });
  }
  ngOnDestroy(): void {
    if (this._isBrowser) {
      const currentUrl = this._router.url;
      if (currentUrl === '/' || currentUrl === '/home') {
        document.body.style.overflow = '';
      }
    }
  }
}
