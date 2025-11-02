import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NeedSupportCardComponent } from './need-support-card.component';

describe('NeedSupportCardComponent', () => {
  let component: NeedSupportCardComponent;
  let fixture: ComponentFixture<NeedSupportCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NeedSupportCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NeedSupportCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
