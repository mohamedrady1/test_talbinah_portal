import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KhawiikBooksSkeletonComponent } from './khawiik-books-skeleton.component';

describe('KhawiikBooksSkeletonComponent', () => {
  let component: KhawiikBooksSkeletonComponent;
  let fixture: ComponentFixture<KhawiikBooksSkeletonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KhawiikBooksSkeletonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KhawiikBooksSkeletonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
