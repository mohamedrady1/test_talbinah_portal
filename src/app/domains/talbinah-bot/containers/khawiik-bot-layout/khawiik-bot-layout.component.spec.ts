import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikBotLayoutComponent } from './khawiik-bot-layout.component';

describe('KhawiikBotLayoutComponent', () => {
  let component: KhawiikBotLayoutComponent;
  let fixture: ComponentFixture<KhawiikBotLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikBotLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikBotLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
