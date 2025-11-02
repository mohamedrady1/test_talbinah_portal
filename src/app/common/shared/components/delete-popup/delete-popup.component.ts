import { Component, inject } from '@angular/core';
import { DeletePopupService } from './service/delete-popup-service.service';
import { OutlineGrayBtnComponent } from "../buttons/outline-gray-btn/outline-gray-btn.component";
import { SolidDangerBtnComponent } from "../buttons/solid-danger-btn/solid-danger-btn.component";
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-popup',
  standalone: true,
  templateUrl: './delete-popup.component.html',
  styleUrls: ['./delete-popup.component.scss'],
  imports: [CommonModule, OutlineGrayBtnComponent, SolidDangerBtnComponent, TranslateModule]
})
export class DeletePopupComponent {
  private deletePopupService = inject(DeletePopupService)
  isOpen$ = this.deletePopupService.isOpen$;
  popupData$ = this.deletePopupService.popupData$;
  constructor() {

  }
  confirmDelete() {
    this.deletePopupService.confirmDelete();
    this.cancelDelete();
  }

  cancelDelete() {
    this.deletePopupService.cancelDelete();
  }
}
