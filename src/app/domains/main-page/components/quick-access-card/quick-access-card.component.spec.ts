import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAccessCardComponent } from './quick-access-card.component';

describe('QuickAccessCardComponent', () => {
  let component: QuickAccessCardComponent;
  let fixture: ComponentFixture<QuickAccessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAccessCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAccessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
