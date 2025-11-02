import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TalbinahIdentityFormComponent } from './talbinah-identity-form.component';

describe('TalbinahIdentityFormComponent', () => {
  let component: TalbinahIdentityFormComponent;
  let fixture: ComponentFixture<TalbinahIdentityFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TalbinahIdentityFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TalbinahIdentityFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
