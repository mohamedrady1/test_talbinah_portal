import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-upload-apps-popup',
  standalone: true,
  imports: [
    TranslateModule
  ],
  templateUrl: './upload-apps-popup.component.html',
  styleUrls: ['./upload-apps-popup.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UploadAppsPopupComponent {
}
