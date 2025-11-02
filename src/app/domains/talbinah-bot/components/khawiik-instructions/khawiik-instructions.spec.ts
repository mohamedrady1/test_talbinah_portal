import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { KhawiikInstructionsComponent } from './khawiik-instructions.component';

describe('KhawiikInstructionsComponent', () => {
    let component: KhawiikInstructionsComponent;
    let fixture: ComponentFixture<KhawiikInstructionsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                KhawiikInstructionsComponent,
                TranslateModule.forRoot()
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(KhawiikInstructionsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit openNext when continue button is clicked', () => {
        spyOn(component.openNext, 'emit');

        const continueButton = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions__continue');
        continueButton.click();

        expect(component.openNext.emit).toHaveBeenCalled();
    });

    it('should render instruction cards', () => {
        const cards = fixture.debugElement.nativeElement.querySelectorAll('.khawiik-instructions__card');
        expect(cards.length).toBe(5);
    });

    it('should have proper accessibility attributes', () => {
        const continueButton = fixture.debugElement.nativeElement.querySelector('.khawiik-instructions__continue');
        expect(continueButton.getAttribute('aria-label')).toBeTruthy();
    });
});
