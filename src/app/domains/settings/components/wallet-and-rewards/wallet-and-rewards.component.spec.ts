import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletAndRewardsComponent } from './wallet-and-rewards.component';

describe('WalletAndRewardsComponent', () => {
  let component: WalletAndRewardsComponent;
  let fixture: ComponentFixture<WalletAndRewardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WalletAndRewardsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WalletAndRewardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
