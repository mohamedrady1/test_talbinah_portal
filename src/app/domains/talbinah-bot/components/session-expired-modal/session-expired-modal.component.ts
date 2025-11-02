import { Component, EventEmitter, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TranslationsFacade } from '../../../../common/core/translations/services';

@Component({
    selector: 'app-session-expired-modal',
    standalone: true,
    imports: [CommonModule, TranslateModule],
    templateUrl: './session-expired-modal.component.html',
    styleUrls: ['./session-expired-modal.component.scss']
})
export class SessionExpiredModalComponent {
    private readonly translationsFacade = inject(TranslationsFacade);
    
    protected readonly translateApi = (key: string, lang?: string) => this.translationsFacade.translate(key, lang);
    
    protected translate(key: string): string {
        return this.translationsFacade.translate(key);
    }
    
    @Output() startNewSession = new EventEmitter<void>();

    onStartNewSession(): void {
        this.startNewSession.emit();
    }
}

