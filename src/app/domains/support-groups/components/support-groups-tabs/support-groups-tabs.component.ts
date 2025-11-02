import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes';

@Component({
  selector: 'app-support-groups-tabs',
  standalone: true,
  imports: [TranslateModule, TranslateApiPipe],
  templateUrl: './support-groups-tabs.component.html',
  styleUrls: ['./support-groups-tabs.component.scss']
})
export class SupportGroupsTabsComponent {

}
