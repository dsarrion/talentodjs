import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyApkComponent } from './my-apk.component';

describe('MyApkComponent', () => {
  let component: MyApkComponent;
  let fixture: ComponentFixture<MyApkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MyApkComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MyApkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
