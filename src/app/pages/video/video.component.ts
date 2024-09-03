import { Component, Input, OnInit, AfterViewInit, ChangeDetectorRef, ElementRef, OnDestroy, ViewChild, OnChanges, SimpleChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Track } from '../../Models/trackModel';
import { TracksService } from '../../services/tracks/tracks.service';
import { ContentComponent } from '../../components/content/content.component';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { CategoryModel } from '../../Models/categoryModel';
import { CommonModule, ViewportScroller } from '@angular/common';
import { Subscription, catchError, combineLatest, delay, retry, throwError} from 'rxjs';
import { ActivatedRoute, ParamMap, RouterLink } from '@angular/router';
import { UnlikeComponent } from '../../components/icon/unlike/unlike.component';
import { LikeComponent } from '../../components/icon/like/like.component';
import { CommentsComponent } from '../../components/icon/comments/comments.component';
import { ShareComponent } from '../../components/icon/share/share.component';
import { CommentsService } from '../../services/commentsLikes/comments.service';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../services/user/user.service';
import { AvatarIconComponent } from '../../components/avatar-icon/avatar-icon.component';
import 'emoji-picker-element';
import { MyApkComponent } from '../../components/my-apk/my-apk.component';

@Component({
  selector: 'app-video',
  standalone: true,
  imports: [CommonModule , ContentComponent, YouTubePlayerModule, RouterLink, UnlikeComponent, LikeComponent, 
            CommentsComponent, ShareComponent, AvatarComponent, AvatarIconComponent, ReactiveFormsModule, MyApkComponent],
  templateUrl: './video.component.html',
  styleUrl: './video.component.css',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class VideoComponent implements OnInit, AfterViewInit, OnChanges, OnDestroy {
  @Input('id') idVideo?: number;
  userLoginOn: boolean = false;
  userId?: number;
  submitted: boolean = false;
  video!: Track;
  idVideoYT!: any;
  idCategory?: number;
  category!:CategoryModel;
  categoryTrends:CategoryModel;
  errorMessage: string = "";
  comments: { content: string, user_avatar: string, user_nick:string }[] = [];
  avatarUserComment: string | null = null;
  showComments: boolean = false;
  showEmojis: boolean = false;
  showModal:boolean = false;
  showError: boolean = false;
  countComments: number = 0;
  haslike: boolean = false;
  likeId?: number;
  form: FormGroup = new FormGroup({});
  private subscriptions: Subscription = new Subscription();

  @ViewChild('demoYouTubePlayer') demoYouTubePlayer!: ElementRef<HTMLDivElement>;
      videoWidth: number | undefined;
      videoHeight: number | undefined;

  constructor(private trackService: TracksService,
              private userService: UserService,
              private commentService: CommentsService, 
              private _changeDetectorRef: ChangeDetectorRef,
              private route: ActivatedRoute,
              private viewportScroller: ViewportScroller,
              private formBuilder: FormBuilder
            ) { 
    this.categoryTrends = {
      'id': 0,
      'name': 'Mas Populares'
    }
  }

  ngOnInit(): void {
    this.initializeForm();
    //Comprobar si el usuario esta logeado y sacar datos
    this.getUserloginOn();
    this.subscribeToRouteChanges();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['idVideo'] && !changes['idVideo'].isFirstChange()) {
      this.subscribeToRouteChanges();
    }
    
  }

  ngAfterViewInit(): void {
    if (typeof window !== 'undefined' && this.demoYouTubePlayer) {
      this.onResize();
      window.addEventListener('resize', this.onResize);
    }
  }

  ngOnDestroy(): void {
      this.subscriptions.unsubscribe();
      if (typeof window !== 'undefined') {
        window.removeEventListener('resize', this.onResize);
      }
    }

  // Inicializar formulario
  private initializeForm(): void {
    this.form = this.formBuilder.group({
      content: ['', [Validators.required, Validators.maxLength(120), Validators.minLength(3)]],
      user_id: [''],
      track_id: ['']
    });
  }

  // Suscribirse a los cambios en la ruta
  private subscribeToRouteChanges(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
    this.subscriptions.add(
      this.route.paramMap.subscribe((params: ParamMap) => {
        const id = params.get('id');
        if (id) {
          this.idVideo = Number(id);
          this.updateVideoData();
        }
      })
    );
  }

  // Actualizar los datos del video y comentarios
  private updateVideoData(): void {
    if (this.idVideo) {
      this.subscriptions.add(
        combineLatest([
          this.trackService.getTrack(this.idVideo),
          this.commentService.getCommentsByVideo(this.idVideo)
        ]).pipe(
          retry(2), // Reintentar la solicitud hasta 2 veces en caso de error
          catchError((error) => {
            console.error('Error al actualizar los datos del video', error);
            return throwError(() => delay(500)); // Retry after 500ms
          })
        ).subscribe({
          next: ([trackData, commentsData]) => {
            
            this.video = trackData.data;
            this.idVideoYT = this.extractVideoId(this.video.url);
            this.idCategory = trackData.data.category_id;
            if(this.idCategory){
              this.getCategory(this.idCategory);
            }
            
            this.comments = commentsData.map((comment: any) => ({
              content: comment.content,
              user_avatar: comment.user_avatar,
              user_nick: comment.user_nick
            }));
            this.countComments = commentsData.length;
            this.hasLikeId(); // Verifica si el usuario dio like al video  
          },
          error: (errorData) => {
            console.error('Error al actualizar los datos del video',errorData);    
          }
        })
      )   
    }
  }

  //Obtener categoria del video para mostrar
  private getCategory(id: number): void{
    this.subscriptions.add(
      this.trackService.getCategory(id).subscribe({
        next: (category) => {
          this.category = category.data;
        },
        error: (errorData) =>{
          console.error('Error al obtener categorias:',errorData);
          setTimeout(() => {
            this.getCategory(this.idCategory!);
        },500);
        }  
      })
    )
  }

  //Verificar si el usuario esta logueado 
  private getUserloginOn(){
    this.subscriptions.add(
      this.userService.currentUserLoginOn.subscribe({
        next: (loginOn) => {
          this.userLoginOn = loginOn;
          //console.log('Usuario logueado:',this.userLoginOn);
          if(this.userLoginOn){
            this.getUserData();
          }else{
            this.hasLikeId();
          } 
        },
        error: (errorData) => {
          console.error('Error al verificar el estado de login:',errorData)
        }
      })
    )
  }

  //Obtener datos de usuario
  private getUserData(){
    this.subscriptions.add(
      this.userService.currentUserData.subscribe({
        next: (dataUser) => {
          this.userId = dataUser?.id;
          if(this.userId){
            this.form.patchValue({ user_id: this.userId }); //Actualiza el formulario con el id del usuario
            this.hasLikeId();
          }
          //console.log('Datos del usuario:', dataUser);
        },
        error: (errorData) => {
          console.error('Error al obtener datos de usuario:',errorData)
        }
      })
    )
  }
  
  get f(): { [key: string]: AbstractControl } {
    return this.form.controls;
  }

  public onSubmit(form: void) {
    
    this.submitted = true;

    if (this.form.invalid) {
      this.logFormErrors();
      return;
    }

    this.sentComment();
  }

  //mostrar o ocultar comentarios
  public toggleComments() {
    this.showComments = !this.showComments;
  }
  //Envio de comentarios
  private sentComment(): void{
    if(this.form.invalid){
      return; // Si el no es válido no hace nada
    }
    this.form.patchValue({ track_id: this.idVideo }); //Actualiza el formulario con el id del video
    this.subscriptions.add(
      this.commentService.createComment(this.form.value).subscribe({
        next: (data)=> {       
          this.submitted = false;
          this.updateComments();
          console.log('Mensaje enviado CORRECTAMENTE');
          this.form.reset();
          // Volver a establecer user_id y track_id después de resetear el formulario
          this.form.patchValue({ user_id: this.userId, track_id: this.idVideo });    
        }, 
        error: (erroData) => {
          console.error('Error al enviar el comentario:' ,erroData);
        }
      })
    )
  }
  // Actualizar comentarios después de enviar uno nuevo
  private updateComments(): void {
    if (this.idVideo) {
      this.subscriptions.add(
        this.commentService.getCommentsByVideo(this.idVideo).subscribe({
          next: (commentsData) => {
            this.comments = commentsData.map((comment: any) => ({
              content: comment.content,
              user_avatar: comment.user_avatar,
              user_nick: comment.user_nick
            }));
            this.countComments = commentsData.length;
            this._changeDetectorRef.detectChanges(); // Forzar la detección de cambios
          },
          error: (errorData) => {
            console.error('Error al actualizar los comentarios', errorData);
          }
        })
      );
    }
  }
  
  //LIKES
  private hasLikeId(){
    if(this.userId && this.idVideo){
      this.subscriptions.add(
        this.commentService.hasLike(this.userId, this.idVideo).subscribe({
          next: (response) =>{
            this.haslike = response.hasLike;
            if(this.haslike){
              this.likeId = response.like.id;
            }
            //console.log('Response from backend:', response.hasLike);
          },
          error: (error) => {
            console.error('Error al verificar like:', error);
            setTimeout(() => {
              this.hasLikeId();
          },500);
          }
        })
      )
    }
  }

  public addFavorite(){
    this.subscriptions.add(
      this.commentService.createLike(this.userId!, this.idVideo!).subscribe({
        next: (response) =>{
          this.haslike = true;
          this.likeId = response.data.id;
          console.log(response.message);
        },
        error: (error) => {
          console.error('Error al enviar like:', error)
        }
      })
    )
  }

  public deleteFavorite(){
    this.subscriptions.add(
      this.commentService.deleteLike(this.likeId!).subscribe({
        next: (response) =>{
          this.haslike = false;
          console.log(response.message);
        },
        error: (error) => {
          console.error('Error al borrar like:', error)
        }
      })
    )
  }

  logFormErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const controlErrors = this.form.get(key)?.errors;
      if (controlErrors != null) {
        console.log(`Control: ${key}, Errors:`, controlErrors);
      }
    });
    this.showErrorsTemporarily();
  }
  private showErrorsTemporarily(): void {
    this.showError = true;
    setTimeout(() => {
      this.showError = false;
    }, 3000); // 3 segundos
  }

  //mostrar o ocultar emojis
  public toggleEmojis() {
    this.showEmojis = !this.showEmojis;
  }
  // Método para agregar un emoji al textarea
  public addEmoji(event: any): void {
    const emoji = event?.detail?.unicode;
    if (emoji) {
      const messageInput = this.form.get('content') as FormControl;
      messageInput.patchValue(messageInput.value + emoji);
    }
  }

  toggleModal() {
    this.showModal = !this.showModal;
  }

  private onResize = (): void => {
    if (typeof window !== 'undefined' && this.demoYouTubePlayer) {
      // Automáticamente expandir el video para ajustar la página hasta 1200px x 720px
      this.videoWidth = Math.min(this.demoYouTubePlayer.nativeElement.clientWidth, 1200);
      this.videoHeight = this.videoWidth * 0.6;
      this._changeDetectorRef.detectChanges();
    }
  }

  //extraer id de YT desde url
  private extractVideoId(url: string): string | null {
    const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regex);
    return match ? match[1] : null;
  }
  
}