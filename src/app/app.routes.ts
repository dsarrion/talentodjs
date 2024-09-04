import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CategoriaComponent } from './pages/categoria/categoria.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { RegistroComponent } from './pages/registro/registro.component';
import { LoginComponent } from './pages/login/login.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { ErrorComponent } from './pages/error/error.component';
import { NewVideoComponent } from './pages/admin/videos/new-video/new-video.component';
import { AdminPanelComponent } from './pages/admin/admin-panel/admin-panel.component';
import { AllVideosComponent } from './pages/admin/videos/all-videos/all-videos.component';
import { EditVideoComponent } from './pages/admin/videos/edit-video/edit-video.component';
import { AddCategoryComponent } from './pages/admin/category/add-category/add-category.component';
import { DeleteCatComponent } from './pages/admin/category/delete-cat/delete-cat.component';
import { EditCatComponent } from './pages/admin/category/edit-cat/edit-cat.component';
import { VideoComponent } from './pages/video/video.component';
import { AjustesComponent } from './pages/ajustes/ajustes.component';
import { FavoritesComponent } from './pages/favorites/favorites.component';
import { AppAndroidComponent } from './pages/app-android/app-android.component';

export const routes: Routes = [
    {path: "", redirectTo:'/inicio', pathMatch:'full'},
    {path: "inicio", component: HomeComponent},
    {path: "categoria/:id", component: CategoriaComponent},
    {path: "sesion/:id", component: VideoComponent},
    {path: "contacto", component: ContactoComponent},
    {path: "registro", component: RegistroComponent},
    {path: "login", component: LoginComponent},
    {path: "ajustes", component: AjustesComponent},
    {path: "perfil", component: PerfilComponent},
    {path: "favoritos", component: FavoritesComponent},
    {path: "app_android", component: AppAndroidComponent},
    {path: "admin_panel", component: AdminPanelComponent},
    {path: "videoUpload", component: NewVideoComponent},
    {path: "all_videos", component: AllVideosComponent},
    {path: "edit_video/:id", component: EditVideoComponent},
    {path: "add_category", component: AddCategoryComponent},
    {path: "delete_cat", component: DeleteCatComponent},
    {path: "edit_cat", component: EditCatComponent},
    {path: "**", component: ErrorComponent}
];
