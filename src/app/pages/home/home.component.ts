import { Component, OnDestroy, OnInit } from '@angular/core';
import { ContentComponent } from '../../components/content/content.component';
import { TracksService } from '../../services/tracks/tracks.service';
import { Subscription } from 'rxjs';
import { SpinnerComponent } from '../../components/spinner/spinner.component';
import { TrendsComponent } from '../../components/trends/trends.component';
import { MyApkComponent } from '../../components/my-apk/my-apk.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ContentComponent, SpinnerComponent, TrendsComponent, MyApkComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy{

  categories?:any;
  private subscriptions: Subscription = new Subscription(); 

  constructor(private trackService: TracksService){}

  ngOnInit(): void {
    this.getCategoriesWithTracks();
  }

  getCategoriesWithTracks() {
    this.subscriptions.add(
      this.trackService.getCategories().subscribe({
        next: (categories) => {
          //console.log("categorias:",categories);
          this.trackService.getAllTracks().subscribe({
            next: (response) => {
              const idsCategories = new Set(response.map((track: any) => track.category_id)); // Sacar los ids de las categorias
              let filteredCategories = categories.filter((category: any) => idsCategories.has(category.id)); // Filtrar las categorías con tracks
                // Mezclar las categorías filtradas de forma aleatoria
              filteredCategories = this.shuffleArray(filteredCategories);
              this.categories = filteredCategories; // Asignar las categorías aleatorias
            },
            error: (errorData) => {
              console.error(errorData);
            },
          })
        },
        error: (errorData) => {
          console.error(errorData);
        },
      })
    )
  }

shuffleArray(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
