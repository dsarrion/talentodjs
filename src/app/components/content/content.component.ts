import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TracksService } from '../../services/tracks/tracks.service';
import { RouterLink } from '@angular/router';
import { NextComponent } from '../icon/next/next.component';
import { CategoryModel } from '../../Models/categoryModel';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-content',
  standalone: true,
  imports: [CommonModule , RouterLink, NextComponent],
  templateUrl: './content.component.html',
  styleUrl: './content.component.css'
})
export class ContentComponent implements OnInit, OnChanges, OnDestroy {

  @Input() category!:CategoryModel;
  videos?: any;
  populares: boolean = false;
  errorTracks:string = "";
  private subscriptions: Subscription = new Subscription();

  constructor(private trackService: TracksService, private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if(this.category.name == "Mas Populares"){
      this.getTrensTracks();
    }
      
    if (changes['category'] && this.category) {
      if(this.category.name == "Mas Populares"){
        this.getTrensTracks();
      }else{
        this.getTracks(this.category.id);
      }
    }
  }

  //Obtener tracks por categoria
  getTracks(category_id:any){
    this.subscriptions.add(
      this.trackService.getTracksByCategory(category_id).subscribe({
        next: (response: any) => {
          this.videos = response.data.slice(0, 6);
          //console.log(this.videos)
        },
        error: (errorTracks) => {
          console.error('Error al obtener los Tracks por categorias', errorTracks);
          this.errorTracks = errorTracks;
        }, 
        complete: () => {
          //console.log("Se han recibido correctamente los tracks", this.videos)
        }
      })
    )
  }

  //Obtener Mas Populares
    getTrensTracks(){
      this.subscriptions.add(
        this.trackService.getTracksLikePaginate().subscribe({
          next: (response) => {
            this.populares = true;
          this.videos = response.data.slice(0, 6);
          },
          error: (error) => {
          console.error('Error al obtener Trendtracks:', error);
        }
        })
      )
    }

  getThumb(url: string, size: string) {
    var video, results, thumburl;

    if (url === null) {
      return '';
    }

    results = url.match('[\\?&]v=([^&#]*)');
    video = (results === null) ? url : results[1];

    if (size != null || size) {
      thumburl = 'https://img.youtube.com/vi/' + video + '/' + size + '.jpg';
    } else {
      thumburl = 'https://img.youtube.com/vi/' + video + '/mqdefault.jpg';
    }

    return thumburl;
  }

  scrollTop(){
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}

/*     Tamaño de las miniaturas de Youtube
          Tamaño pequeño: default
          Tamaño mediano: hqdefault
          Tamaño estándar mqdefault
          Tamaño grande: sddefault
          Máxima calidad maxresdefault
 */