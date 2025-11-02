import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SafeHtml } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-modal',
  standalone: true,
  imports: [
    TranslateModule,
    CommonModule
  ],
  templateUrl: './custom-modal.component.html',
  styleUrls: ['./custom-modal.component.scss'],
  // animations: [
  //   trigger('fadeInOut', [
  //     state('void', style({ opacity: 0 })),
  //     transition(':enter', [
  //       animate('150ms', style({ opacity: 1 }))
  //     ]),
  //     transition(':leave', [
  //       animate('150ms', style({ opacity: 0 }))
  //     ])
  //   ])
  // ]
})
export class CustomModalComponent {
  @Output() submitForm = new EventEmitter<void>();
  @Output() close = new EventEmitter<void>();
  @Input() modalBorderRounded: string = '';
  @Input() customHeaderClass: string = '';
  @Input() customContentClass: string = 'modal-content p-6';
  @Input() modalWidth: string = '55%';
  @Input() description: string = '';
  @Input() isOpen: boolean = false;
  @Input() modalHeight: string = '';
  @Input() headerFlag: string = '';
  @Input() titleIcon: string | SafeHtml = '';
  @Input() title: string = '';
  @Input() isLoading = false;
  @Input() displayCloseIcon = true;

  // Closes the modal
  closeModal(): void {
    this.isOpen = false;
    this.close.emit();
  }
}
