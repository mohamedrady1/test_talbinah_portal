import { ChangeDetectionStrategy, Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface PercentageKnobConfig {
    size?: number;
    strokeWidth?: number;
    primaryColor?: string;
    secondaryColor?: string;
    textColor?: string;
    showValue?: boolean;
    showPercentage?: boolean;
    fontSize?: number;
    fontWeight?: string;
    animationDuration?: number;
}

@Component({
    selector: 'app-percentage-knob',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './percentage-knob.component.html',
    styleUrls: ['./percentage-knob.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PercentageKnobComponent {
    @Input() set value(val: number) {
        this._value.set(this.clampValue(val));
    }
    get value(): number {
        return this._value();
    }

    @Input() set config(config: Partial<PercentageKnobConfig>) {
        this._config.set({ ...this.defaultConfig, ...config });
    }
    get config(): PercentageKnobConfig {
        return this._config();
    }

    private readonly defaultConfig: PercentageKnobConfig = {
        size: 120,
        strokeWidth: 8,
        primaryColor: '#000000', // أسود
        secondaryColor: '#E5E7EB',
        textColor: '#000000', // أسود
        showValue: true,
        showPercentage: true,
        fontSize: 16,
        fontWeight: '600',
        animationDuration: 1000
    };

    private readonly _value = signal<number>(0);
    private readonly _config = signal<PercentageKnobConfig>(this.defaultConfig);

    readonly percentage = computed(() => Math.round(this._value() * 100));

    readonly strokeColor = computed(() => 'var(--text-dark)');
    readonly textColor = computed(() => 'var(--text-dark)');
    readonly backgroundColor = computed(() => 'var(--grey-200)');

    readonly radius = computed(() => 42); // Fixed radius to match SVG viewBox
    readonly circumference = computed(() => 2 * Math.PI * this.radius());
    readonly strokeDasharray = computed(() => this.circumference());
    readonly strokeDashoffset = computed(() => {
        const progress = this._value();
        return this.circumference() * (1 - progress);
    });

    readonly centerX = computed(() => 50); // Fixed center to match SVG viewBox
    readonly centerY = computed(() => 50); // Fixed center to match SVG viewBox

    readonly displayText = computed(() => {
        const config = this._config();
        let text = '';

        if (config.showValue) {
            text += this.percentage().toString();
        }

        if (config.showPercentage && config.showValue) {
            text += '%';
        } else if (config.showPercentage) {
            text = '100%';
        }

        return text || this.percentage().toString();
    });

    readonly styles = computed(() => {
        const config = this._config();
        return {
            width: `${config.size}px`,
            height: `${config.size}px`,
            fontSize: `${config.fontSize}px`,
            fontWeight: config.fontWeight,
            color: this.textColor()
        };
    });

    readonly svgStyles = computed(() => {
        const config = this._config();
        return {
            width: `${config.size}px`,
            height: `${config.size}px`
        };
    });

    readonly circleStyles = computed(() => {
        const config = this._config();
        return {
            stroke: this.strokeColor(),
            strokeWidth: config.strokeWidth,
            strokeDasharray: this.strokeDasharray(),
            strokeDashoffset: this.strokeDashoffset(),
            transition: `stroke-dashoffset ${config.animationDuration}ms ease-in-out`
        };
    });

    readonly backgroundCircleStyles = computed(() => {
        const config = this._config();
        return {
            stroke: this.backgroundColor(),
            strokeWidth: config.strokeWidth
        };
    });

    private clampValue(value: number): number {
        return Math.max(0, Math.min(1, value));
    }
}