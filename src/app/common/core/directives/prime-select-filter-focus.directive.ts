import { Directive, ElementRef, HostListener, OnInit } from '@angular/core';
import { Select } from 'primeng/select';

@Directive({
    selector: '[appPrimeSelectFilterFocus]'
})
export class PrimeSelectFilterFocusDirective implements OnInit {

    constructor(private el: ElementRef, private selectComponent: Select) {
    }

    ngOnInit() {
        if (!(this.selectComponent instanceof Select)) {
            console.warn('The appPrimeSelectFilterFocus directive should only be applied to a p-select component.');
        }
    }

    @HostListener('onShow')
    onSelectShow() {
        setTimeout(() => {
            const filterInput = this.el.nativeElement.querySelector('.p-select-filter') as HTMLInputElement;

            if (filterInput) {
                filterInput.blur();
            }
        }, 0);
    }
}