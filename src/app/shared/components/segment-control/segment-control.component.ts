import { Component, Input, Output, EventEmitter, signal, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../common/core/translations';

export interface SegmentOption {
    id: string | number;
    title: string;
}

@Component({
    selector: 'app-segment-control',
    standalone: true,
    imports: [
        CommonModule

    ],
    templateUrl: './segment-control.component.html',
    styleUrls: ['./segment-control.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SegmentControlComponent {
    private readonly translationsFacade = inject(TranslationsFacade);
    
    @Input() options: SegmentOption[] = [];
    @Input() selectedId: string | number | null = null;
    @Output() selectionChanged = new EventEmitter<SegmentOption>();

    protected translate(key: string): string {
        return this.translationsFacade.translate(key);
    }

    selectOption(option: SegmentOption): void {
        this.selectedId = option.id;
        this.selectionChanged.emit(option);
    }

    isSelected(option: SegmentOption): boolean {
        return this.selectedId === option.id;
    }
}




