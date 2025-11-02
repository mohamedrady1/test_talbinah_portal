import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-supervising-doctors-card',
  standalone: true,
  imports: [TranslateModule],
  templateUrl: './supervising-doctors-card.component.html',
  styleUrls: ['./supervising-doctors-card.component.scss']
})
export class SupervisingDoctorsCardComponent {

  isFavourited = signal(false);

  @Input() supervisingDoctorsDetails: any = {
    title: " د. أحمد مسند",
    date: "26 إبريل 2025",
    duration: 65,
    imageUrl: "images/trash/doctor.png",
    isFavourited: false,
    recommended: true
  }
    ;
  @Output() favouriteToggled = new EventEmitter<any>();
  @Output() openPopupAction = new EventEmitter<void>();

  protected addToFavourite(): void {
    this.isFavourited.update((value: any) => !value);
    this.favouriteToggled.emit(this.supervisingDoctorsDetails);
  }
  protected openPopup(): void {
    this.openPopupAction.emit();
  }
}
