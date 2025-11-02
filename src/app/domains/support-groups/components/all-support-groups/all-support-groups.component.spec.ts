import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllSupportGroupsComponent } from './all-support-groups.component';

describe('AllSupportGroupsComponent', () => {
  let component: AllSupportGroupsComponent;
  let fixture: ComponentFixture<AllSupportGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllSupportGroupsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllSupportGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
