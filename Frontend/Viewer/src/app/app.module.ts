import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { PdfViewerModule } from 'ng2-pdf-viewer';

// COMPONENTS

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { AccountComponent } from './components/buttons/account/account.component';
import { SettingsComponent } from './components/buttons/settings/settings.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { BodyComponent } from './components/body/body.component';
import { NotesComponent } from './components/notes/notes.component';
import { PurseComponent } from './components/purse/purse.component';
import { ArchiveComponent } from './components/archive/archive.component';
import { RegisterComponent } from './components/register/register.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FileUploadComponent } from './components/file-upload/file-upload.component';
import { ModalDeleteComponent } from './components/modal-delete/modal-delete.component';
import { DocumentsComponent } from './components/documents/documents.component';

// ANGULAR MATERIAL

import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import { ModalEditComponent } from './components/modal-edit/modal-edit.component';
import { MusicComponent } from './components/music/music.component';
import { VideoComponent } from './components/video/video.component';




@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    AccountComponent,
    SettingsComponent,
    SidenavComponent,
    BodyComponent,
    NotesComponent,
    PurseComponent,
    ArchiveComponent,
    RegisterComponent,
    GalleryComponent,
    FileUploadComponent,
    ModalDeleteComponent,
    DocumentsComponent,
    ModalEditComponent,
    MusicComponent,
    VideoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    PdfViewerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
