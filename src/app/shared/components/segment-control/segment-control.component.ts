import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

export interface SegmentOption {
    id: string | number;
    title: string;
}

@Component({
    selector: 'app-segment-control',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './segment-control.component.html',
    styleUrls: ['./segment-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SegmentControlComponent {
    @Input() options: SegmentOption[] = [];
    @Input() selectedId: string | number | null = null;
    @Output() selectionChanged = new EventEmitter<SegmentOption>();

    selectOption(option: SegmentOption): void {
        this.selectedId = option.id;
        this.selectionChanged.emit(option);
    }

    isSelected(option: SegmentOption): boolean {
        return this.selectedId === option.id;
    }
}




