import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { DoctorImage } from '../../configs';

@Component({
  selector: 'app-doctor-gallery',
  standalone: true,
  imports: [],
  templateUrl: './doctor-gallery.component.html',
  styleUrls: ['./doctor-gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DoctorGalleryComponent {
  @Input() images!: DoctorImage[];
}
