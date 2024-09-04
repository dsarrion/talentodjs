import { Component } from '@angular/core';
import { AppAndroidComponent } from '../../pages/app-android/app-android.component';
import { RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';

@Component({
  selector: 'app-my-apk',
  standalone: true,
  imports: [ RouterLink, AppAndroidComponent ],
  templateUrl: './my-apk.component.html',
  styleUrl: './my-apk.component.css'
})
export class MyApkComponent {

  constructor(private viewportScroller: ViewportScroller){}

  scrollTop(){
    this.viewportScroller.scrollToPosition([0, 0]);
  }
}
