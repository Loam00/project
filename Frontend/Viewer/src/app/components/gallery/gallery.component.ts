import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Files } from 'src/app/models/Files';
import { User } from 'src/app/models/User';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit{

  titleText = "image";
  showMask = false;
  showCount = false;
  currentIndex = 0;
  totalCount = 0;
  currentLightboxImage: Files;
  check = false;
  fileObject: Files[];
  idFileGallery: number;
  userId: Pick<User, "id_user"> | number;
  typeName = "image";
  folderName = "images";
  showDownload = false;
  showDelete = false;

  leftExtrem = 0;
  rightExtrem = 9;
  pageIndex = 0;
  pages: number[];

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.fileObject = [];
    this.pages = [];
    this.reset();
    this.currentLightboxImage = this.fileObject[0];
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

  reset() {
    this.getFileObject().then( (files) => {
      this.fileObject = files;

      for(let i=0; i<files.length; i++) {
        this.fileObject[i].path = "http://localhost:3000/" + files[i].path
      }

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
    this.idFileGallery = id_file;
    this.showDelete = true;
  }

  public async delete(idFile: number): Promise<void> {
    console.log(this.currentIndex)
    await this.archiveService.delete(idFile, this.folderName);
    if(this.currentIndex != 0)
    {
      this.currentLightboxImage = this.fileObject[this.currentIndex - 1];
      this.currentIndex = this.currentIndex - 1;
    } else {
      this.currentLightboxImage = this.fileObject[this.currentIndex + 1];
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

  openGalleryAtImage(index: number) {
    this.showMask = true;
    index = index + ( this.pageIndex * 10 );
    this.currentIndex = index;
    this.currentLightboxImage = this.fileObject[index]
    this.totalCount = this.fileObject.length;
  }

  closeGallery() {
    this.showMask = false;
  }

  prev(index: number) {
    if(index > 0) {
      this.currentLightboxImage = this.fileObject[index - 1];
      this.currentIndex = index - 1;

      if ( this.currentIndex == this.leftExtrem - 1 && this.pageIndex >= 1) {
        this.pageIndex = this.pageIndex - 1;
        this.changePage(this.pageIndex, "ArrowLeft");
      }
    }
  }

  next(index: number) {
    if(index < this.fileObject.length - 1) {
      this.currentLightboxImage = this.fileObject[index + 1];
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
