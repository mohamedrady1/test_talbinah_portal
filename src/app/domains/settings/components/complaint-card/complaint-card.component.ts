import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { IDoctorTicketDto } from '../../dtos';

export interface IComplaint extends IDoctorTicketDto {
    // Extends the original DTO to maintain compatibility
}

@Component({
    selector: 'app-complaint-card',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './complaint-card.component.html',
    styleUrls: ['./complaint-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ComplaintCardComponent {
    @Input() complaint!: IComplaint;
    @Output() cardClick = new EventEmitter<IComplaint>();

    onCardClick(): void {
        this.cardClick.emit(this.complaint);
    }

    getStatusText(): string {
        return this.complaint.status === '-1'
            ? 'pending'
            : 'resolved';
    }

    getTitle(): string {
        return this.complaint.problem?.problem || this.complaint.other_problem || 'مشكلة غير محددة';
    }

    getImages(): string[] {
        return this.complaint.image?.map(img => img.url) || [];
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleDateString('ar-EG', { month: 'long' });
        const weekday = date.toLocaleDateString('ar-EG', { weekday: 'long' });

        return `${day} ${month} - ${weekday}`;
    }
} 