import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  computed,
  effect,
  Output,
  EventEmitter
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { GiftsFacade } from '../../services/gifts.facade';
import { CountriesLookupFacade, ICountryDto } from '../../../lookups';
import { SelectModule } from 'primeng/select';
import { IGiftSendRequestDto } from '../../dtos';
import { StatusInfoComponent } from '../../../payments/components';
import { ModalService } from '../../../../shared';

@Component({
  selector: 'app-send-gift-form',
  standalone: true,
  imports: [
    CommonModule,
    SelectModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule
  ],
  templateUrl: './send-gift-form.component.html',
  styleUrls: ['./send-gift-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SendGiftFormComponent {
  @Output() public closed = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private giftsFacade = inject(GiftsFacade);
  private countriesService = inject(CountriesLookupFacade);
  private modalService = inject(ModalService);

  protected submitted = false;
  protected form: FormGroup;

  protected readonly isLoading = this.giftsFacade.isLoadingSend;
  protected readonly errorMessage = this.giftsFacade.errorMessageSend();
  protected readonly status = this.giftsFacade.statusSend();

  private readonly allowedPhoneCodesInOrder = ['+966', '+965', '+973', '+974', '+971', '+968', '+20'];

  protected readonly countriesList = computed(() => this.countriesService.Countries());
  protected readonly isLoadingCountries = computed(() => this.countriesService.isLoading());

  protected readonly allowedCountries = computed(() => {
    const countries = this.countriesList()?.data ?? [];
    return this.allowedPhoneCodesInOrder
      .map(code => countries.find(c => c.phone_code === code))
      .filter((c): c is NonNullable<typeof c> => !!c);
  });

  selectedCountryModel = signal<ICountryDto | null>(null);

  constructor() {
    this.form = this.fb.group({
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      amount: ['', [Validators.required, Validators.min(1)]]
    });
    this.countriesService.fetchCountries();

    effect(() => {
      const countries = this.allowedCountries();
      if (countries.length > 0 && !this.selectedCountryModel()) {
        const saudiCountry = countries.find(c => c.phone_code === '+966');
        if (saudiCountry) {
          this.selectedCountryModel.set(saudiCountry);
        }
      }
    });

    effect(() => {
      if (!this.giftsFacade.isLoadingSend() && this.giftsFacade.statusSend()) {
        this.closed.emit();
      }
    });
  }

  get formControls() {
    return this.form.controls;
  }

  protected onSubmit(): void {
    this.submitted = true;

    if (this.form.invalid || !this.selectedCountryModel()) {
      this.form.markAllAsTouched();
      return;
    }

    const selectedCountry = this.selectedCountryModel();

    const payload: IGiftSendRequestDto = {
      phone: this.form.value.phone,
      amount: +this.form.value.amount,
      country_id: selectedCountry?.id ?? 0,
      payment_id: 1
    };

    this.giftsFacade.sendGift(payload);

    this.watchForResponse();
  }

  private watchForResponse(): void {
    const checkStatus = () => {
      if (!this.giftsFacade.isLoadingSend() && this.giftsFacade.statusSend() !== null) {
        const status = this.giftsFacade.statusSend();
        const errorMessage = this.giftsFacade.errorMessageSend();

        if (status) {
          this.openSuccessModal();
        } else {
          this.openErrorModal(errorMessage);
        }
        return;
      }

      setTimeout(checkStatus, 100);
    };

    checkStatus();
  }

  private openSuccessModal(): void {
    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'settings.giftLovedOnes.seConfirmed',
        statusTitleKey: 'gift.sendSuccessTitle',
        statusSubtitleKey: 'gift.sendSuccessSubtitle',
        data: {
          item: {
            storeSuccess: true,
            pageType: 'send-gift'
          }
        }
      },
      outputs: {
        closed: () => {
          this.resetFormAndState();
          this.closed.emit();
        }
      },
      onCloseClick: () => {
        this.resetFormAndState();
        this.closed.emit();
      },
      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }

  private openErrorModal(errorMessage: string | null): void {
    this.modalService.open(StatusInfoComponent, {
      inputs: {
        image: 'images/mentalHealthScale/icons/talbinah.png',
        title: 'settings.giftLovedOnes.seError',
        statusTitleKey: errorMessage,
        statusSubtitleKey: 'gift.sendErrorSubtitle',
        data: {
          item: {
            storeSuccess: false,
            errorMessage: errorMessage,
            pageType: 'send-gift'
          },
          statusLabels: {
            errorSubTitle: errorMessage
          }
        }
      },
      outputs: {
        closed: () => {
          this.closed.emit();
        }
      },

      width: '40%',
      isPhoneFromDown: true,
      minHeight: '10rem',
      maxHeight: '60rem',
    });
  }

  private resetFormAndState(): void {
    this.submitted = false;
    this.form.reset();
    this.giftsFacade.resetSendState();
  }
}