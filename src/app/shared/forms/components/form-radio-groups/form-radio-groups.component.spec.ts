import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormRadioGroupsComponent } from './form-radio-groups.component';

describe('FormRadioGroupsComponent', () => {
  let component: FormRadioGroupsComponent;
  let fixture: ComponentFixture<FormRadioGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormRadioGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormRadioGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
