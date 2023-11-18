import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { NotesComponent } from './components/notes/notes.component';
import { PurseComponent } from './components/purse/purse.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { SettingsComponent } from './components/settings/settings.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuardService } from './services/auth-guard.service';
import { GalleryComponent } from './components/gallery/gallery.component';
import { DocumentsComponent } from './components/documents/documents.component';
import { MusicComponent } from './components/music/music.component';
import { VideoComponent } from './components/video/video.component';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'notes', component: NotesComponent, canActivate: [AuthGuardService]},
  {path: 'purse', component: PurseComponent, canActivate: [AuthGuardService]},
  {
    path: 'archive',
    component: ArchiveComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'gallery',
        component: GalleryComponent,
      },
      {
        path: 'documents',
        component: DocumentsComponent,
      },
      {
        path: 'music',
        component: MusicComponent,
      },
      {
        path: 'video',
        component: VideoComponent,
      },
    ]
  },
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
