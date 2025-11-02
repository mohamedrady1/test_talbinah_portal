import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsRewardDetailsComponent } from './settings-reward-details.component';

describe('SettingsRewardDetailsComponent', () => {
  let component: SettingsRewardDetailsComponent;
  let fixture: ComponentFixture<SettingsRewardDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsRewardDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingsRewardDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
