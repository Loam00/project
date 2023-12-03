import { Component, OnInit, Input, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Files } from 'src/app/models/Files';
import { User } from 'src/app/models/User';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';

interface currentTime {
  minutes: number;
  seconds: number;
}

interface currentDuration {
  minutes: number;
  seconds: number;
}

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
  context = new AudioContext();
  currentBuffer: AudioBuffer;
  source: AudioBufferSourceNode;
  currentTime: currentTime;
  currentDuration: currentDuration;

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
    this.currentTime = {minutes: 0, seconds: 0};
    this.currentDuration = {minutes: 0, seconds: 0}
  }

  constructor( private archiveService: ArchiveService, private authService: AuthService) {}

  checkExistance(fileName: string, fileObjectName: string) {
    if( fileName == fileObjectName ) {
      return true;
    } else {
      return false
    }
  }

  writeFileName(Data: Pick<Files, "name" | "file">) {
    let givenName = Data.name;
    if(Data.name == null){
      const sendName = Data.file.name.split(".");
      Data.name = sendName[0];
      givenName = sendName[0];
    }

    for(let i=0; i<this.fileObject.length; i++) {

      const fileName = this.fileObject[i].name.split(".")

      if(Data.name == fileName[0]) {

        let j = 1;
        let stop = true;
        while(stop) {
          let check = false;

          for(let k=0; k < this.fileObject.length; k++) {

            const fileName = this.fileObject[k].name.split(".");

            if(this.checkExistance(`${givenName}(${j})`, `${fileName[0]}`)) {
              j++;
              check = true;
              break;
            }
          }
          if(check == false) {
            Data.name = `${givenName}(${j})`;
            stop = false;
          }
        }

        if ( stop == false) {
          break;
        }
      }
    }

    return Data;
  }

  public async onSubmit(Data: Pick<Files, "name" | "file">): Promise<void> {

    await this.archiveService.uploadFile(this.writeFileName(Data), this.authService.userId)
    this.reset();
  }

  /* GETTING CODE */

  getFileObject(): Promise<Files[]> {
    return this.archiveService.getFileObject(this.userId, this.typeName);
  }

  getFiles(id_file: number): Promise<ArrayBuffer> {
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
    console.log(this.idFileMusic);
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



    this.loadSong(this.currentTrack);

  }

  loadSong(track: Files) {
    this.getFiles(track.id_file).then( (file) => {

      this.source = this.context.createBufferSource();
      this.context.suspend();

      this.context.decodeAudioData(file, (buf) => {
        this.source.buffer = buf;
        this.currentBuffer = this.source.buffer;
        this.source.connect(this.context.destination);
        this.currentTrack.audioStream = this.source;
        this.context.resume();

        this.context.addEventListener('statechange', () => {
          console.log(this.context.state);
          this.getTrackTime(this.currentBuffer, this.context)
        })
        this.source.start(0);

      })


    }).then( () => {
      const playBtn = document.querySelector<HTMLButtonElement>('#play-track');
      const trackContainer = document.querySelector('.track-container');

      trackContainer.classList.add('play');
      playBtn.querySelector('.play-button').classList.remove('bxs-right-arrow');
      playBtn.querySelector('.play-button').classList.add('bx-pause');
    })


  }

  getTrackTime(currentBuffer: AudioBuffer, context: AudioContext) {

    const secs = parseInt( `${currentBuffer.duration % 60}`, 10);
    const mins = parseInt( `${(currentBuffer.duration/60) % 60}`, 10);

    this.currentDuration.seconds = secs;
    this.currentDuration.minutes = mins;
  }

  closeMusic() {
    this.showMask = false;
    this.source.disconnect(this.context.destination);
  }

  /* PLAYER */

  playSong(time: number, source: AudioBufferSourceNode) {
    const playBtn = document.querySelector<HTMLButtonElement>('#play-track');
    const trackContainer = document.querySelector('.track-container');

    trackContainer.classList.add('play');
    playBtn.querySelector('.play-button').classList.remove('bxs-right-arrow');
    playBtn.querySelector('.play-button').classList.add('bx-pause');

    if(time > 0 && this.context.state === 'suspended') {
      this.context.resume();
    }
  }

  pauseSong(time: number, source: AudioBufferSourceNode) {
    const playBtn = document.querySelector<HTMLButtonElement>('#play-track');
    const trackContainer = document.querySelector('.track-container');

    trackContainer.classList.remove('play');
    playBtn.querySelector('.play-button').classList.remove('bx-pause');
    playBtn.querySelector('.play-button').classList.add('bxs-right-arrow');

    if( this.context.state === 'running') {
      this.context.suspend();
    }
  }


  play(index: number, source: AudioBufferSourceNode) {
    console.log("ciao");
    const playBtn = document.querySelector<HTMLButtonElement>('#play-track');
    const trackContainer = document.querySelector('.track-container');

    const isPlaying = trackContainer.classList.contains('play')

    if (isPlaying) {
      this.pauseSong(this.context.currentTime, source);
    }
    else {
      this.playSong(this.context.currentTime, source);
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

    this.source.disconnect(this.context.destination);
    this.loadSong(this.currentTrack);

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

    this.source.disconnect(this.context.destination);
    this.loadSong(this.currentTrack);

  }

  keyListener(index: number, event: KeyboardEvent, currentTrack: AudioBufferSourceNode) {
    if( this.showDownload == false && this.showDelete == false && this.showMask == true ){
      if(event.key == "ArrowRight") {
        this.next(index);
      } else if (event.key == "ArrowLeft") {
        this.prev(index);
      } else if (event.key == "Delete") {
        this.openDelete(this.fileObject[index].id_file)
      } else if (event.key == "Escape") {
        this.closeMusic();
      } else if (event.key == "Enter" || event.key == " ") {
        this.play(index, currentTrack);
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
