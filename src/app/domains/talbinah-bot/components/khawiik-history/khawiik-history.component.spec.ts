import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikHistoryComponent } from './khawiik-history.component';

describe('KhawiikHistoryComponent', () => {
  let component: KhawiikHistoryComponent;
  let fixture: ComponentFixture<KhawiikHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
