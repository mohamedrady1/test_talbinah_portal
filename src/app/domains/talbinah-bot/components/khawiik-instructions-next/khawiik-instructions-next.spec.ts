import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { KhawiikInstructionsNextComponent } from './khawiik-instructions-next.component';

describe('KhawiikInstructionsNextComponent', () => {
    let component: KhawiikInstructionsNextComponent;
    let fixture: ComponentFixture<KhawiikInstructionsNextComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                KhawiikInstructionsNextComponent,
                TranslateModule.forRoot()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(KhawiikInstructionsNextComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit submit when continue button is clicked with valid text', () => {
        spyOn(component.submit, 'emit');

        // Set valid text
        const textarea = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions-next__textarea');
        textarea.value = 'Test text';
        textarea.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const continueButton = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions-next__continue');
        continueButton.click();

        expect(component.submit.emit).toHaveBeenCalledWith({
            text: 'Test text',
            timestamp: jasmine.any(String),
            chatType: 'text'
        });
    });

    it('should not emit submit when continue button is clicked with invalid text', () => {
        spyOn(component.submit, 'emit');

        // Set invalid text (empty or too short)
        const textarea = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions-next__textarea');
        textarea.value = 'a';
        textarea.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const continueButton = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions-next__continue');
        expect(continueButton.disabled).toBe(true);

        continueButton.click();
        expect(component.submit.emit).not.toHaveBeenCalled();
    });

    it('should have proper accessibility attributes', () => {
        const textarea = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions-next__textarea');
        const continueButton = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions-next__continue');

        expect(textarea.getAttribute('aria-label')).toBeTruthy();
        expect(continueButton.getAttribute('aria-label')).toBeTruthy();
    });

    it('should handle keyboard shortcuts', () => {
        spyOn(component.submit, 'emit');

        const textarea = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions-next__textarea');
        textarea.value = 'Test text';
        textarea.dispatchEvent(new Event('input'));
        fixture.detectChanges();

        const keyEvent = new KeyboardEvent('keydown', { key: 'Enter', ctrlKey: true });
        textarea.dispatchEvent(keyEvent);

        expect(component.submit.emit).toHaveBeenCalledWith({
            text: 'Test text',
            timestamp: jasmine.any(String),
            chatType: 'text'
        });
    });
});
