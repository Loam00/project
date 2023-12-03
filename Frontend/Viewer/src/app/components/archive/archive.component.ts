import { Component, OnInit, DoCheck, OnChanges, SimpleChanges, Input } from '@angular/core';
import { navDataArchive } from './navDataArchive';
import { Router } from '@angular/router';
import { Files } from 'src/app/models/Files';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/User';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit, DoCheck{

  navDataArchive = navDataArchive;
  checkRoute: boolean;
  lastImages: Files[];
  lastDocuments: Files[];
  lastTracks: Files[];
  userId: Pick<User, "id_user">;
  checkImages = false;

  constructor( private router: Router, private archiveService: ArchiveService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.lastImages = [];
    this.lastDocuments = [];
    this.lastTracks = [];
    this.reset();
  }

  ngDoCheck(): void {
    if ( this.router.url == "/archive") {
      this.checkRoute = true;
    } else {
      this.checkRoute = false;
    }
  }

  getLastImages(): Promise<Files[]> {
    return this.archiveService.getFileObject(this.userId, "image");
  }

  getLastDocuments(): Promise<Files[]> {
    return this.archiveService.getFileObject(this.userId, "application");
  }

  getLastTracks(): Promise<Files[]> {
    return this.archiveService.getFileObject(this.userId, "audio");
  }

  reset() {
    this.getLastImages().then( (images) => {
      let length;
      if ( images.length < 4) {
        length = images.length;
      } else {
        length = 4;
      }

      if ( images.length != 0) {
        for( let i=0; i < length; i++) {
          this.lastImages[i] = images[images.length - (length - i)];
          this.lastImages[i].path = "http://localhost:3000/" + images[images.length - (length - i)].path;
        }
      } else if ( images.length == 0) {
        this.checkImages = true;
      }
    })

    this.getLastDocuments().then( (documents) => {

    })

    this.getLastTracks().then( (tracks) => {

    })
  }

}
