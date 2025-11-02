import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PercentageKnobComponent } from './percentage-knob.component';

describe('PercentageKnobComponent', () => {
    let component: PercentageKnobComponent;
    let fixture: ComponentFixture<PercentageKnobComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [PercentageKnobComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(PercentageKnobComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should clamp value between 0 and 1', () => {
        component.value = 1.5;
        expect(component.value).toBe(1);

        component.value = -0.5;
        expect(component.value).toBe(0);

        component.value = 0.7;
        expect(component.value).toBe(0.7);
    });

    it('should calculate percentage correctly', () => {
        component.value = 0.75;
        expect(component.percentage()).toBe(75);

        component.value = 0.5;
        expect(component.percentage()).toBe(50);

        component.value = 0;
        expect(component.percentage()).toBe(0);
    });

    it('should display correct text based on config', () => {
        component.value = 0.75;

        // Default config shows both value and percentage
        expect(component.displayText()).toBe('75%');

        // Test showing only value
        component.config = { ...component.config, showPercentage: false };
        expect(component.displayText()).toBe('75');

        // Test showing only percentage
        component.config = { ...component.config, showValue: false, showPercentage: true };
        expect(component.displayText()).toBe('100%');
    });

    it('should apply custom config correctly', () => {
        const customConfig = {
            size: 200,
            primaryColor: '#FF0000',
            fontSize: 24
        };

        component.config = customConfig;

        expect(component.config.size).toBe(200);
        expect(component.config.primaryColor).toBe('#FF0000');
        expect(component.config.fontSize).toBe(24);
        expect(component.config.strokeWidth).toBe(8); // Should keep default
    });

    it('should calculate SVG properties correctly', () => {
        component.config = { size: 120, strokeWidth: 8 };

        expect(component.radius()).toBe(56); // (120 - 8) / 2
        expect(component.centerX()).toBe(60); // 120 / 2
        expect(component.centerY()).toBe(60); // 120 / 2
    });

    it('should calculate stroke dash offset correctly', () => {
        component.config = { size: 120, strokeWidth: 8 };
        component.value = 0.5;

        const circumference = component.circumference();
        expect(component.strokeDashoffset()).toBe(circumference * 0.5);
    });
}); 