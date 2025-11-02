import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportsComponent } from './visit-reports.component';

describe('VisitReportsComponent', () => {
  let component: VisitReportsComponent;
  let fixture: ComponentFixture<VisitReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
