import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormSingleSelectComponent } from './form-single-select.component';

describe('FormSingleSelectComponent', () => {
  let component: FormSingleSelectComponent;
  let fixture: ComponentFixture<FormSingleSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormSingleSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormSingleSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
