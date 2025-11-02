import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubscribeSuccessfullyComponent } from './subscribe-successfully.component';

describe('SubscribeSuccessfullyComponent', () => {
  let component: SubscribeSuccessfullyComponent;
  let fixture: ComponentFixture<SubscribeSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscribeSuccessfullyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SubscribeSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
