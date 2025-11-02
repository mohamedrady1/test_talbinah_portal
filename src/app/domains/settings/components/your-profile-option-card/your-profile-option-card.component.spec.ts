import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourProfileOptionCardComponent } from './your-profile-option-card.component';

describe('YourProfileOptionCardComponent', () => {
  let component: YourProfileOptionCardComponent;
  let fixture: ComponentFixture<YourProfileOptionCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [YourProfileOptionCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourProfileOptionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
