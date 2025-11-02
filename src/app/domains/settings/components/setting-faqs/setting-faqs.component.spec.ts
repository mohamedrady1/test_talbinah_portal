import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingFaqsComponent } from './setting-faqs.component';

describe('SettingFaqsComponent', () => {
  let component: SettingFaqsComponent;
  let fixture: ComponentFixture<SettingFaqsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingFaqsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SettingFaqsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
