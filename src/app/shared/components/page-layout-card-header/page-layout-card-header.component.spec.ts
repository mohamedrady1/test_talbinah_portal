import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageLayoutCardHeaderComponent } from './page-layout-card-header.component';

describe('PageLayoutCardHeaderComponent', () => {
  let component: PageLayoutCardHeaderComponent;
  let fixture: ComponentFixture<PageLayoutCardHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageLayoutCardHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageLayoutCardHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
