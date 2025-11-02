import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitReportCardComponent } from './visit-report-card.component';

describe('VisitReportCardComponent', () => {
  let component: VisitReportCardComponent;
  let fixture: ComponentFixture<VisitReportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisitReportCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VisitReportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
