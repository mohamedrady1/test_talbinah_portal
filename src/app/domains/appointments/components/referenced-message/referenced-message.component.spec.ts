import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferencedMessageComponent } from './referenced-message.component';

describe('ReferencedMessageComponent', () => {
  let component: ReferencedMessageComponent;
  let fixture: ComponentFixture<ReferencedMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferencedMessageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReferencedMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
