import { Component } from '@angular/core';
import { DialogService } from './service/DialogService.service';
import { SolidBtnComponent } from "../buttons/solid-btn/solid-btn.component";
import { TranslateModule } from '@ngx-translate/core';
import { BUTTON_CONFIGS } from './configs/BUTTON_CONFIGS';

@Component({
  selector: 'app-dialog',
  standalone: true,
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
  imports: [SolidBtnComponent, TranslateModule]
})
export class DialogComponent {
  isOpen = false;
  message = '';
  isSuccess = true;
  cancelButton = BUTTON_CONFIGS.cancelButton;
  constructor(private dialogService: DialogService) {
    this.dialogService.isOpen$.subscribe(status => (this.isOpen = status));
    this.dialogService.message$.subscribe(msg => (this.message = msg));
    this.dialogService.isSuccess$.subscribe(status => (this.isSuccess = status));
  }

  closeDialog() {
    this.dialogService.closeDialog();
  }
}
