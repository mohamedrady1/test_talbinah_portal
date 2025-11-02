import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DetailsForMobileComponent } from './details-for-mobile.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DetailsForMobileComponent', () => {
    let component: DetailsForMobileComponent;
    let fixture: ComponentFixture<DetailsForMobileComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DetailsForMobileComponent, TranslateModule.forRoot()]
        })
            .compileComponents();

        fixture = TestBed.createComponent(DetailsForMobileComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should emit close event when close button is clicked', () => {
        spyOn(component.close, 'emit');
        const closeButton = fixture.nativeElement.querySelector('.details-for-mobile__close-btn');
        closeButton.click();
        expect(component.close.emit).toHaveBeenCalled();
    });

    it('should not show close button when showCloseButton is false', () => {
        component.showCloseButton = false;
        fixture.detectChanges();
        const closeButton = fixture.nativeElement.querySelector('.details-for-mobile__close-btn');
        expect(closeButton).toBeNull();
    });

    it('should apply background style when background input is provided', () => {
        const testBackground = 'linear-gradient(45deg, #ff6b6b, #4ecdc4)';
        component.background = testBackground;
        fixture.detectChanges();
        const element = fixture.nativeElement.querySelector('.details-for-mobile');
        expect(element.style.background).toBe(testBackground);
    });
}); 