import { Component,OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Files } from 'src/app/models/Files';
import { User } from 'src/app/models/User';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';
import { navDataArchive } from './navDataArchive';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.component.html',
  styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit {

  showMask = false;
  showCount = false;
  currentIndex = 0;
  totalCount = 0;
  fileText = "Choose your file";
  currentLightboxImage: Files;
  check = false;
  files: Files[];
  form: FormGroup;
  imageData: string;
  userId: Pick<User, "id_user"> | number;
  idFile: number;
  navDataArchive = navDataArchive;

  data: any;

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.files = [];
    this.form = new FormGroup({
      name: new FormControl(null),
      file: new FormControl(null)
    });
/*     this.reset(); */
    this.currentLightboxImage = this.files[0];
  }

  constructor( private archiveService: ArchiveService, private authService: AuthService) {}

/*
  openGalleryAtImage(index: number) {
    this.showMask = true;
    this.currentIndex = index;
    this.currentLightboxImage = this.files[index]
    this.totalCount = this.files.length;
  }

  closeGallery() {
    this.showMask = false;
  }

  prev(index: number) {
    this.currentLightboxImage = this.files[index - 1];
    this.currentIndex = index - 1;
  }

  next(index: number) {
    this.currentLightboxImage = this.files[index + 1];
    this.currentIndex = index + 1;
  }

  downloadFile() {

  } */
}
