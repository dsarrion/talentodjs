import { Component } from '@angular/core';
import { AndroidComponent } from "../../components/icon/android/android.component";
import { DownloadComponent } from '../../components/icon/download/download.component';

@Component({
  selector: 'app-app-android',
  standalone: true,
  imports: [AppAndroidComponent, AndroidComponent, DownloadComponent],
  templateUrl: './app-android.component.html',
  styleUrl: './app-android.component.css'
})
export class AppAndroidComponent {

}
