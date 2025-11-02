import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { DoctorCardGovernmentAgencyComponent } from '../doctor-card-government-agency';
import { GovernmentAgenciesDoctorsFacade } from '../../services';
import { AutoExactHeightDirective, CardType } from '../../../../common';
import { EmptyStateCardComponent, ErrorStateCardComponent } from '../../../../shared';
import { governmentAgenciesEmptyConfig, governmentAgenciesErrorConfig } from '../../configs';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
  selector: 'app-government-agencies-doctors',
  standalone: true,
  imports: [
    DoctorCardGovernmentAgencyComponent,
    CommonModule,
    FormsModule,
    ErrorStateCardComponent,
    EmptyStateCardComponent,
    AutoExactHeightDirective,
    
  ],
  templateUrl: './government-agencies-doctors.component.html',
  styleUrls: ['./government-agencies-doctors.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GovernmentAgenciesDoctorsComponent {
  private readonly translationsFacade = inject(TranslationsFacade);
  protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
  protected translate(key: string): string { return this.translationsFacade.translate(key); }
  
  readonly facade = inject(GovernmentAgenciesDoctorsFacade);

  protected cardTypes = CardType;

  readonly searchQuery = signal('');
  protected emptyState = governmentAgenciesEmptyConfig;
  protected errorState = governmentAgenciesErrorConfig(() => this.facade.updateFilters({ search: '' }));

  readonly filteredDoctors = computed(() => {
    const query = this.searchQuery().toLowerCase();
    const doctors = this.facade.doctors();
    if (!Array.isArray(doctors)) return [];

    return doctors.filter(d =>
      d.full_name?.toLowerCase().includes(query)
    );
  });

  readonly isLoading = this.facade.isLoading;
  readonly errorMessage = this.facade.errorMessage;

  onSearch(value: string): void {
    this.searchQuery.set(value);
    this.facade.updateFilters({ search: value });
  }

  clearSearch(): void {
    this.searchQuery.set('');
    this.facade.updateFilters({ search: '' });
  }
}

