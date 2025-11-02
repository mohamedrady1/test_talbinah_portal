import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-payments-layout',
  standalone: true,
  imports: [
    RouterModule
  ],
  templateUrl: './payments-layout.component.html',
  styleUrls: ['./payments-layout.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaymentsLayoutComponent {

}
