import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WelcomeToTalbinahCommunityCardComponent } from './welcome-to-talbinah-community-card.component';

describe('WelcomeToTalbinahCommunityCardComponent', () => {
  let component: WelcomeToTalbinahCommunityCardComponent;
  let fixture: ComponentFixture<WelcomeToTalbinahCommunityCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WelcomeToTalbinahCommunityCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WelcomeToTalbinahCommunityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
