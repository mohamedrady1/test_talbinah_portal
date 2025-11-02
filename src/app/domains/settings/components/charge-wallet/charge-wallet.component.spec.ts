import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeWalletComponent } from './charge-wallet.component';

describe('ChargeWalletComponent', () => {
  let component: ChargeWalletComponent;
  let fixture: ComponentFixture<ChargeWalletComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChargeWalletComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChargeWalletComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
