import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppAndroidComponent } from './app-android.component';

describe('AppAndroidComponent', () => {
  let component: AppAndroidComponent;
  let fixture: ComponentFixture<AppAndroidComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppAndroidComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AppAndroidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
