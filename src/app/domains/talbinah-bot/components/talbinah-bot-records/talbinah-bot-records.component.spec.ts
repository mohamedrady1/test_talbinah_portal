import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalbinahBotRecordsComponent } from './talbinah-bot-records.component';

describe('TalbinahBotRecordsComponent', () => {
  let component: TalbinahBotRecordsComponent;
  let fixture: ComponentFixture<TalbinahBotRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalbinahBotRecordsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalbinahBotRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
