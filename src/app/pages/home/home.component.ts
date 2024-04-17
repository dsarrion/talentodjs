import { Component } from '@angular/core';
import { ContentComponent } from '../../components/content/content.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContentComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}