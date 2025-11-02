import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportGroupCardComponent } from './support-group-card.component';

describe('SupportGroupCardComponent', () => {
  let component: SupportGroupCardComponent;
  let fixture: ComponentFixture<SupportGroupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportGroupCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SupportGroupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
