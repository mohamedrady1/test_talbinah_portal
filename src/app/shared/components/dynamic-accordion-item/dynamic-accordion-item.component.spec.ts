import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicAccordionItemComponent } from './dynamic-accordion-item.component';

describe('DynamicAccordionItemComponent', () => {
  let component: DynamicAccordionItemComponent;
  let fixture: ComponentFixture<DynamicAccordionItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicAccordionItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicAccordionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
