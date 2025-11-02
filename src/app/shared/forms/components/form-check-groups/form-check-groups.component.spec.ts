import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCheckGroupsComponent } from './form-check-groups.component';

describe('FormCheckGroupsComponent', () => {
  let component: FormCheckGroupsComponent;
  let fixture: ComponentFixture<FormCheckGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormCheckGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormCheckGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
