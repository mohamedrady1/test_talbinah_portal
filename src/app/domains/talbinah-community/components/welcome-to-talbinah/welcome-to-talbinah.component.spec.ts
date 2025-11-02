import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeToTalbinahComponent } from './welcome-to-talbinah.component';

describe('WelcomeToTalbinahComponent', () => {
  let component: WelcomeToTalbinahComponent;
  let fixture: ComponentFixture<WelcomeToTalbinahComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeToTalbinahComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeToTalbinahComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
