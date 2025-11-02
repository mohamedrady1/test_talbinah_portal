import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignToCustomerSupportComponent } from './assign-to-customer-support.component';

describe('AssignToCustomerSupportComponent', () => {
  let component: AssignToCustomerSupportComponent;
  let fixture: ComponentFixture<AssignToCustomerSupportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignToCustomerSupportComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignToCustomerSupportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
