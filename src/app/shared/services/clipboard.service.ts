import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ClipboardService {
    copyToClipboard(text: string): void {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
                .then(() => console.log('Text copied to clipboard'))
                .catch(err => console.error('Could not copy text: ', err));
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.position = 'fixed'; // Avoid scrolling to bottom
            document.body.appendChild(textarea);
            textarea.focus();
            textarea.select();
            try {
                document.execCommand('copy');
                console.log('Text copied to clipboard (fallback)');
            } catch (err) {
                console.error('Fallback: Could not copy text: ', err);
            }
            document.body.removeChild(textarea);
        }
    }
}