import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalbinahBotLayoutComponent } from './talbinah-bot-layout.component';

describe('TalbinahBotLayoutComponent', () => {
  let component: TalbinahBotLayoutComponent;
  let fixture: ComponentFixture<TalbinahBotLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalbinahBotLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalbinahBotLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
