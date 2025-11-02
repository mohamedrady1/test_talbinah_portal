import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikWelcomeComponent } from './khawiik-welcome.component';

describe('KhawiikWelcomeComponent', () => {
  let component: KhawiikWelcomeComponent;
  let fixture: ComponentFixture<KhawiikWelcomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikWelcomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikWelcomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
