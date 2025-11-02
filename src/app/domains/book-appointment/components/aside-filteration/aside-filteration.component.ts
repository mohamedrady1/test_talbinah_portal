import {
  ChangeDetectionStrategy,
  Component,
  computed,
  EventEmitter,
  inject,
  Output,
  signal,
  HostListener,
  OnInit,
  AfterViewInit,
  PLATFORM_ID,
  effect,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import {
  DynamicAccordionItemComponent,
  AccordionItem,
} from '../../../../shared';
import { DoctorsFitrationParametersFacade } from '../../services';
import { filterHeader } from '../../constants';
import { AutoExactHeightDirective, Logger } from '../../../../common';
import { rating } from '../../data';
import { AsideFilterationSkeletonComponent } from '../aside-filteration-skeleton';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AppointmentType, appointmentTypesConfig } from '../../configs';
import { TranslateApiPipe } from '../../../../common/core/translations';

export interface AsideFilterationFormModel {
  specialty: number | null;
  gender: string | null;
  rate: number | null;
  services_ids: number[];
  languages_ids: number[];
  min_price: number;
  max_price: number;
  appointment_type?: string | null;
}

@Component({
  selector: 'app-aside-filteration',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    DynamicAccordionItemComponent,
    AsideFilterationSkeletonComponent,
    AutoExactHeightDirective,
    TranslateApiPipe
  ],
  templateUrl: './aside-filteration.component.html',
  styleUrls: ['./aside-filteration.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsideFilterationComponent implements OnInit, AfterViewInit, OnChanges {
  private _ActivatedRoute = inject(ActivatedRoute);

  // Signal for query param value
  readonly appointmentTypeId = toSignal(
    this._ActivatedRoute.queryParamMap.pipe(
      map(params => params.get('typeId') ?? '')
    ),
    { initialValue: '' }
  );

  // Signal for full appointment type object
  readonly appointmentType = computed<AppointmentType | null>(() => {
    const id = this.appointmentTypeId();
    return appointmentTypesConfig.find(t => t.id === id) ?? null;
  });


  readonly accordionItemConfig: AccordionItem = filterHeader;

  readonly isOpen = signal(false);
  readonly isFilterDrawerOpen = signal(false);
  readonly showFilterButton = signal(false);

  @Input() resetTrigger: any;

  private readonly facade = inject(DoctorsFitrationParametersFacade);
  private readonly fb = inject(FormBuilder);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  readonly isLoading = this.facade.isLoading;
  readonly error = this.facade.error;

  readonly specialtiesList = computed(() =>
    this.facade.parameters()?.specialties?.data.map(item => ({
      label: item.name,
      value: item.id
    })) ?? []
  );

  readonly gendersList = computed(() =>
    this.facade.parameters()?.gender?.data.map(item => {
      const key = Object.keys(item)[0] as keyof typeof item;
      return { label: key === 'male' ? 'ذكر' : 'أنثى', value: item[key] };
    }) ?? []
  );

  readonly languagesList = computed(() =>
    this.facade.parameters()?.languages?.data.map(item => ({
      label: item.title,
      value: item.id
    })) ?? []
  );

  readonly servicesList = computed(() =>
    this.facade.parameters()?.services?.data.map(item => ({
      label: item.title,
      value: item.id
    })) ?? []
  );

  readonly priceRange = computed(() => ({
    min: this.facade.parameters()?.min_price?.data ?? 0,
    max: this.facade.parameters()?.max_price?.data ?? 1000,
  }));

  readonly ratingList = rating;

  readonly appointmentForm: FormGroup = this.fb.group({
    specialty: [null],
    gender: [null],
    rate: [null],
    services_ids: this.fb.control<number[]>([]),
    languages_ids: this.fb.control<number[]>([]),
    min_price: [this.priceRange().min],
    max_price: [this.priceRange().max],
  });

  @Output() formSubmitted = new EventEmitter<AsideFilterationFormModel>();

  constructor() {
    effect(() => {
      const typeId = this.appointmentTypeId();
      this.facade.load(typeId);
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      this.checkScreenSize();
    };
  }

  ngAfterViewInit(): void {
    if (this.isBrowser) this.checkScreenSize();
  }

  @HostListener('window:resize')
  onResize(): void {
    if (this.isBrowser) this.checkScreenSize();
  }

  private checkScreenSize(): void {
    if (!this.isBrowser) return;
    const screenWidth = window.innerWidth;
    const isSmallScreen = screenWidth < 1200;

    this.showFilterButton.set(isSmallScreen);

    if (!isSmallScreen && this.isFilterDrawerOpen()) {
      this.closeFilterDrawer();
    }
  }

  protected toggleMultiValue(formKey: keyof AsideFilterationFormModel, value: any): void {
    const ctrl = this.appointmentForm.get(formKey as string) as FormControl<any[]>;
    const current = ctrl.value ?? [];
    ctrl.setValue(
      current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value]
    );
    ctrl.markAsTouched();
  }

  protected onSubmit(): void {
    if (this.appointmentForm.valid) {
      const payload = this.appointmentForm.getRawValue();
      Logger.debug('AsideFilterationComponent => ✅ Form Submitted Payload:', payload);
      this.formSubmitted.emit(payload);
      this.closeFilterDrawer();
    } else {
      this.appointmentForm.markAllAsTouched();
    }
  }

  protected resetForm(): void {
    this.appointmentForm.reset({
      specialty: null,
      gender: null,
      rate: null,
      services_ids: [],
      languages_ids: [],
      min_price: this.priceRange().min,
      max_price: this.priceRange().max,
    });
    const payload = this.appointmentForm.getRawValue();
    this.formSubmitted.emit(payload);
    this.closeFilterDrawer();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['resetTrigger'] && !changes['resetTrigger'].firstChange) {
      this.resetForm();
    }
  }

  protected toggleFilterDrawer(): void {
    this.isFilterDrawerOpen.set(!this.isFilterDrawerOpen());
    this.toggleBodyScroll();
  }

  protected closeFilterDrawer(): void {
    this.isFilterDrawerOpen.set(false);
    this.toggleBodyScroll();
  }

  private toggleBodyScroll(): void {
    if (!this.isBrowser) return;
    document.body.style.overflow = this.isFilterDrawerOpen() ? 'hidden' : '';
  }
}
