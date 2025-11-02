import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy,
  Input,
  computed,
} from '@angular/core';
import { generateInitials, shouldShowImage, getAvatarBackgroundColor, SvgIconComponent } from '../../../../shared';
import { IGlobalReservationModel } from '../../models';
import { AgoraRtcService } from '../../../../common';
import { RemoteUserComponent } from "../remote-user";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-remote-stream',
  standalone: true,
  imports: [
    CommonModule,
    RemoteUserComponent,
    SvgIconComponent
  ],
  templateUrl: './remote-stream.component.html',
  styleUrls: ['./remote-stream.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RemoteStreamComponent implements OnDestroy {
  @Input() currentReservationData: IGlobalReservationModel | null = null;
  private readonly agora = inject(AgoraRtcService);

  // Signals
  public readonly remoteUsers = this.agora.remoteUsers;

  // Computed values
  public readonly doctorInitials = computed(() =>
    generateInitials(this.currentReservationData?.doctor?.full_name)
  );
  public readonly shouldShowDoctorImage = computed(() =>
    shouldShowImage(this.currentReservationData?.doctor?.image)
  );
  public readonly doctorAvatarBackgroundColor = computed(() =>
    getAvatarBackgroundColor(this.currentReservationData?.doctor?.full_name)
  );

  ngOnDestroy(): void {
    // Cleanup any manual DOM manipulations
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.video-container').forEach(el => {
        el.innerHTML = '';
      });
    }
  }
}
