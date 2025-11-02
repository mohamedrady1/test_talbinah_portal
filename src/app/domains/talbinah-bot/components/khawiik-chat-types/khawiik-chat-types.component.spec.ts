import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikChatTypesComponent } from './khawiik-chat-types.component';

describe('KhawiikChatTypesComponent', () => {
  let component: KhawiikChatTypesComponent;
  let fixture: ComponentFixture<KhawiikChatTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikChatTypesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikChatTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
