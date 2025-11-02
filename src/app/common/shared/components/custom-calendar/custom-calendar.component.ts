import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { PublicService } from '../../../../shared/services/public.service';
import { FormPopupComponent } from "../form-popup/form-popup.component";
import { PopupService } from '../form-popup/service/popup.service';
import { DialogService } from '../success-popup/service/DialogService.service';
import { Calendar, CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { DatePickerModule } from 'primeng/datepicker';
import { PRIME_NG_CONFIG } from 'primeng/config';

@Component({
  selector: 'app-custom-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, FormPopupComponent, DatePickerModule, CalendarModule],
  templateUrl: './custom-calendar.component.html',
  styleUrls: ['./custom-calendar.component.scss']
})
export class CustomCalendarComponent {
  selectedDate: Date = new Date();
  daysInMonth: { day: number; isCurrentMonth: boolean; dayStatus: string }[] = [];
  currentMonth: number = new Date().getMonth();
  currentMonthName!: string;
  currentYear: number = new Date().getFullYear();
  yearList: number[] = [];
  showYearList: boolean = false;
  currentLanguage!: string;

  private publicService = inject(PublicService);
  private platformId = inject(PLATFORM_ID);
  private popupService = inject(PopupService)
  private dialogService = inject(DialogService)
  private primengConfig = inject(PRIME_NG_CONFIG)

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.currentLanguage = this.publicService.getCurrentLanguage();
    }
  } monthNames: string[] = [
    'monthNames.january', 'monthNames.february', 'monthNames.march', 'monthNames.april', 'monthNames.may', 'monthNames.june',
    'monthNames.july', 'monthNames.august', 'monthNames.september', 'monthNames.october', 'monthNames.november', 'monthNames.december'
  ];
  ngOnInit(): void {
    this.generateCalendar();
    this.generateYearList();
  }

  generateCalendar() {
    const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
    const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    const prevMonthDays = firstDay;
    const prevMonthLastDay = new Date(this.currentYear, this.currentMonth, 0).getDate();

    const nextMonthDays = 35 - (daysInMonth + prevMonthDays);

    this.daysInMonth = [];

    for (let i = prevMonthLastDay - prevMonthDays + 1; i <= prevMonthLastDay; i++) {
      this.daysInMonth.push({ day: i, isCurrentMonth: false, dayStatus: 'holiday' }); // سيتم وضعه كعطلة
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const dayOfWeek = new Date(this.currentYear, this.currentMonth, i).getDay();
      let dayStatus = 'workDay'; // الافتراضي هو يوم عمل

      if (dayOfWeek === 5 || dayOfWeek === 6) {
        dayStatus = 'weekend';
      }

      if (i === 25) {
        dayStatus = 'holiday';
      }

      this.daysInMonth.push({ day: i, isCurrentMonth: true, dayStatus });
      this.currentMonthName = this.monthNames[this.currentMonth];

    }

    for (let i = 1; i <= nextMonthDays; i++) {
      this.daysInMonth.push({ day: i, isCurrentMonth: false, dayStatus: 'holiday' });
    }
  }

  generateYearList() {
    this.yearList = [];
    for (let i = 0; i < 10; i++) {
      this.yearList.push(this.currentYear + i);
    }
  }
  @ViewChild('calendar') calendar!: Calendar;
  date: Date | null = null;

  openCalendar() {
    if (this.calendar) {
      this.calendar.showOverlay();
    }
  }
  selectDate(day: { day: number, isCurrentMonth: boolean }) {
    if (day.isCurrentMonth) {
      this.selectedDate = new Date(this.currentYear, this.currentMonth, day.day);
    } else {
      if (this.currentMonth === 0 && day.day > 28) { // إذا كانت الأيام من الشهر السابق
        this.currentMonth = 11; // الشهر السابق هو ديسمبر
        this.currentYear--;
      } else if (this.currentMonth === 11 && day.day < 7) { // إذا كانت الأيام من الشهر التالي
        this.currentMonth = 0; // الشهر التالي هو يناير
        this.currentYear++;
      }
      this.generateCalendar(); // إعادة توليد التقويم بعد تحديد يوم من الشهر الآخر
    }
  }


  selectYear(year: number) {
    this.currentYear = year;
    this.generateCalendar();  // إعادة توليد التقويم للسنة المحددة
    this.showYearList = false;  // إخفاء قائمة السنوات بعد اختيار سنة
  }

  toggleYearList() {
    this.showYearList = !this.showYearList;  // التبديل بين إظهار وإخفاء قائمة السنوات
  }
  getFormattedNumber(number: number): string {
    const locale = this.currentLanguage === 'ar' ? 'ar-EG' : 'en-US';

    return new Intl.NumberFormat(locale, { useGrouping: false }).format(number);
  }
  previousYear() {
    this.currentYear--;
    this.generateYearList();
  }
  nextYear() {
    this.currentYear++;
    this.generateYearList();
  }
  editDayStatus(day: any) {
    console.log(day.dayStatus)
    const config = [
      {
        name: 'dayStatus',
        title: 'inputs.dayStatus.title',
        type: 'dropdown',
        options: [
          { label: this.publicService?.translateTextFromJson('dayStatus.publicHoliday'), value: 'holiday' },
          { label: this.publicService?.translateTextFromJson('dayStatus.weeklyHoliday'), value: 'weekend' },
          { label: this.publicService?.translateTextFromJson('dayStatus.workDay'), value: 'workDay' },
        ],
        value: day.dayStatus,
        required: true,
        placeholder: 'inputs.dayStatus.placeholder',
        validationMessage: 'inputs.dayStatus.validationMessage'
      },
    ];

    this.popupService.openPopup({
      popupTitle: 'jobGrades.addJobGrades',
      popupBtnTitle: 'general.add',
      fields: config
    });

  }
  handleFormSubmit(formData: any) {
    console.log('Received form data:', formData);
    this.popupService.setLoading(true);
    setTimeout(() => {
      this.popupService.setLoading(false);
      this.popupService.closePopup();
      this.dialogService.openDialog('general.successRequest', true);
    }, 1000);
  }
  onDateSelect(event: Date) {
    if (event) {
      this.selectedDate = event;
      this.currentMonth = event.getMonth();
      this.currentYear = event.getFullYear();
      this.generateCalendar();

      console.log(`Selected Month: ${this.currentMonth + 1}, Year: ${this.currentYear}`);
    }
  }


  nextMonth() {
    this.currentMonth = (this.currentMonth + 1) % 12;
    if (this.currentMonth === 0) {
      this.currentYear++;
    }
    this.generateCalendar();
  }

  prevMonth() {
    this.currentMonth = (this.currentMonth - 1 + 12) % 12;
    if (this.currentMonth === 11) {
      this.currentYear--;
    }
    this.generateCalendar();
  }
}
