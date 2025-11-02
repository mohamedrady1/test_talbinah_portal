import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitationCodeComponent } from './invitation-code.component';

describe('InvitationCodeComponent', () => {
  let component: InvitationCodeComponent;
  let fixture: ComponentFixture<InvitationCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvitationCodeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvitationCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
