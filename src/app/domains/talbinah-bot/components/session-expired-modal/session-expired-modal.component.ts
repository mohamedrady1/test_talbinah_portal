import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateApiPipe } from '../../../../common/core/translations/pipes/translate-api.pipe';

@Component({
    selector: 'app-session-expired-modal',
    standalone: true,
    imports: [CommonModule, TranslateModule, TranslateApiPipe],
    templateUrl: './session-expired-modal.component.html',
    styleUrls: ['./session-expired-modal.component.scss']
})
export class SessionExpiredModalComponent {
    @Output() startNewSession = new EventEmitter<void>();

    onStartNewSession(): void {
        this.startNewSession.emit();
    }
}

