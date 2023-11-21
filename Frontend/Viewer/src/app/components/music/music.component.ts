import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Files } from 'src/app/models/Files';
import { User } from 'src/app/models/User';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit{

  titleText = "track";
  showMask = false;
  showCount = false;
  currentIndex = 0;
  totalCount = 0;
  currentTrack: Files;
  check = false;
  fileObject: Files[];
  idFileMusic: number;
  userId: Pick<User, "id_user"> | number;
  typeName = "audio";
  folderName = "music";
  showDownload = false;
  showDelete = false;
  defaultIMG = "assets/images/360_F_551971815_nXv1fCga04nd9fkjYr0rV0lbu5mG4lHk.jpg";
  defaultTrack = "assets/file_example_WAV_1MG.wav"
  leftExtrem = 0;
  rightExtrem = 9;
  pageIndex = 0;
  pages: number[];

  /* TRACK CSS VARIABLES */

  prevBtn = document.querySelector('#prev-track');
  nextBtn = document.querySelector('#next-track');
  progress = document.querySelector('.progress');
  progressContainer = document.querySelector('.progress-container');
  trackTitle = document.querySelector<HTMLElement>('#track-title');
  trackCover = document.querySelector<HTMLImageElement>('#track-cover');

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.fileObject = [];
    this.pages = [];
    this.reset();
    this.currentTrack = this.fileObject[0];
  }

  constructor( private archiveService: ArchiveService, private authService: AuthService) {}

  public async onSubmit(Data: Pick<Files, "name" | "file">): Promise<void> {
    console.log(Data)

    if(Data.name == null){
      const sendName = Data.file.name.split(".");
      Data.name = sendName[0];
      console.log(sendName)
    }
    await this.archiveService.uploadFile(Data, this.authService.userId)
    this.reset();
  }

  /* GETTING CODE */

  getFileObject(): Promise<Files[]> {
    return this.archiveService.getFileObject(this.userId, this.typeName);
  }

  getFiles(id_file: number): Promise<File> {
    console.log(this.archiveService.getFile(id_file));
    return this.archiveService.getFile(id_file);
  }

  reset() {
/*     this.getFiles().then( (file) => {
      let i = 0;
      file.forEach( fetchedFile => {
        this.fileObject[i].fileStream = fetchedFile;
        i++;
        console.log("oooo")
      });
    }); */

    this.getFileObject().then( (files) => {
/*       for(let i=0; i<files.length; i++) {
        this.fileObject[i].created = files[i].created;
        this.fileObject[i].id_file = files[i].id_file;
        this.fileObject[i].id_user = files[i].id_user;
        this.fileObject[i].name = files[i].name;
        console.log("ehi")
      } */

      this.fileObject = files

      console.log(files)

      const pageLength = Math.ceil(this.fileObject.length/10);
      this.pages = [];

      for(let i = 0; i < pageLength; i++) {
        this.pages[i] = i;
      }

      this.checking()
    });
  }

  checking() {
    if( this.fileObject.length != 0 ) {
      this.check = true;
    } else if ( this.fileObject.length == 0) {
      this.check = false;
    }
  }

  /* DELETE CODE */

  async openDelete(id_file: number) {
    const modelDiv = document.getElementById("modalDelete");
    if(modelDiv != null)
    {
      modelDiv.style.display = "flex";
    }
    this.idFileMusic = id_file;
    this.showDelete = true;
  }

  public async delete(idFile: number): Promise<void> {
    await this.archiveService.delete(idFile, this.folderName);
    if(this.currentIndex != 0)
    {
      this.currentTrack = this.fileObject[this.currentIndex - 1];
      this.currentIndex = this.currentIndex - 1;
    } else {
      this.currentTrack = this.fileObject[this.currentIndex + 1];
    }
    this.totalCount = this.totalCount - 1;
    this.reset();
    if( this.totalCount == 0) {
      this.showMask = false;
    }
  }

  /* CHANGE PAGE */

  changePage(pageNumber: number, event: string) {
    this.pageIndex = pageNumber;
    this.leftExtrem = pageNumber*10;
    this.rightExtrem = pageNumber*10 + 9;

    const selectedPage = document.querySelectorAll(".pageButton");

    selectedPage.forEach( (select) => {
      select.addEventListener( `${event}`, () => {
        document.querySelector(".selectedButton")?.classList.remove("selectedButton");
        select.classList.add("selectedButton");
      })
    })
  }

  openMusic(currentIndex: number) {
    this.showMask = true;
    this.currentTrack = this.fileObject[currentIndex];
    this.getFiles(this.currentTrack.id_file).then( (file) => {
      this.currentTrack.fileStream = file;
    })

    console.log(this.currentTrack.fileStream)
    console.log(this.currentTrack.name + " / " + currentIndex)
/*     this.loadSong(this.currentTrack); */
  }

  closeMusic() {
    this.showMask = false;
  }

  /* PLAYER */

  loadSong(song: Files) {
    const trackAudio = document.querySelector<HTMLAudioElement>('#track-audio');
    /* trackAudio = new Audio();
    trackAudio.load();
    trackAudio.play(); */
    console.log(trackAudio)
  }

  //LISTENER

  playSong() {
    const playBtn = document.querySelector<HTMLButtonElement>('#play-track');
    const trackContainer = document.querySelector('.track-container');
    const trackAudio = document.querySelector<HTMLAudioElement>('#track-audio');
    trackContainer.classList.add('play');
    playBtn.querySelector('.play-button').classList.remove('bxs-right-arrow');
    playBtn.querySelector('.play-button').classList.add('bx-pause');

    trackAudio.play();
  }

  pauseSong() {
    const playBtn = document.querySelector<HTMLButtonElement>('#play-track');
    const trackContainer = document.querySelector('.track-container');
    const trackAudio = document.querySelector<HTMLAudioElement>('#track-audio');
    trackContainer.classList.remove('play');
    playBtn.querySelector('.play-button').classList.remove('bx-pause');
    playBtn.querySelector('.play-button').classList.add('bxs-right-arrow');

    trackAudio.pause();
  }


  play(index: number) {
    const playBtn = document.querySelector<HTMLButtonElement>('#play-track');
    const trackContainer = document.querySelector('.track-container');

    const isPlaying = trackContainer.classList.contains('play');

    if (isPlaying) {
      this.pauseSong();
    }
    else {
      this.playSong();
    }

  }

  prev(index: number) {
    if(index > 0) {
      this.currentTrack = this.fileObject[index - 1];
      this.currentIndex = index - 1;

      if ( this.currentIndex == this.leftExtrem - 1 && this.pageIndex >= 1) {
        this.pageIndex = this.pageIndex - 1;
        this.changePage(this.pageIndex, "ArrowLeft");
      }
    }
  }

  next(index: number) {
    if(index < this.fileObject.length - 1) {
      this.currentTrack = this.fileObject[index + 1];
      this.currentIndex = index + 1;

      if ( this.currentIndex == this.rightExtrem + 1 && this.pageIndex < this.pages.length - 1) {
        this.pageIndex = this.pageIndex + 1;
        this.changePage(this.pageIndex, "ArrowRight");
      }
    }
  }

  keyListener(index: number, event: KeyboardEvent) {
    if( this.showDownload == false && this.showDelete == false && this.showMask == true ){
      if(event.key == "ArrowRight") {
        this.next(index);
      } else if (event.key == "ArrowLeft") {
        this.prev(index);
      } else if (event.key == "Delete") {
        this.openDelete(this.fileObject[index].id_file)
      } else if (event.key == "Escape") {
        this.showMask = false;
      } else if (event.key == "Enter") {
        this.play(index);
      }
    } else if ( this.showDownload == false && this.showDelete == false && this.showMask == false ) {
      if(event.key == "ArrowRight" && this.pageIndex < this.pages.length - 1) {
        this.pageIndex = this.pageIndex + 1;
        this.leftExtrem = this.pageIndex*10;
        this.rightExtrem = this.pageIndex*10 + 9;
      } else if (event.key == "ArrowLeft" && this.pageIndex >= 1) {
        this.pageIndex = this.pageIndex - 1;
        this.leftExtrem = this.pageIndex*10;
        this.rightExtrem = this.pageIndex*10 + 9;
      }
    }
  }

  downloadFile() {

  }

}
