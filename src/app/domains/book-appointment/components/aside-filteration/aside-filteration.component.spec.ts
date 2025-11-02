import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AsideFilterationComponent } from './aside-filteration.component';

describe('AsideFilterationComponent', () => {
  let component: AsideFilterationComponent;
  let fixture: ComponentFixture<AsideFilterationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AsideFilterationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AsideFilterationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
