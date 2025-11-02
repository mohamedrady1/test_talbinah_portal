import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalbinahCardComponent } from './talbinah-card.component';

describe('TalbinahCardComponent', () => {
  let component: TalbinahCardComponent;
  let fixture: ComponentFixture<TalbinahCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalbinahCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalbinahCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
