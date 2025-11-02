import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRewardsComponent } from './settings-rewards.component';

describe('SettingsRewardsComponent', () => {
  let component: SettingsRewardsComponent;
  let fixture: ComponentFixture<SettingsRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsRewardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
