import { Component, OnInit } from '@angular/core';
import { Files } from 'src/app/models/Files';
import { User } from 'src/app/models/User';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrls: ['./documents.component.css']
})
export class DocumentsComponent implements OnInit{
  showMask = false;
  titleText = "document";
  idFileDocument: number;
  check = false;
  files: Files[];
  userId: Pick<User, "id_user"> | number;
  typeName = "application";
  folderName = "documents";
  currentDocument: Files;
  currentIndex = 0;
  showDownload = false;
  showDelete = false;

  leftExtrem = 0;
  rightExtrem = 9;
  pageIndex = 0;
  pages: number[];

  constructor(private archiveService: ArchiveService, private authService: AuthService) {}

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.files = [];
    this.pages = [];
    this.reset();
  }

  public async onSubmit(Data: Pick<Files, "name" | "file">): Promise<void> {
    if(Data.name == null){
      const sendName = Data.file.name.split(".");
      Data.name = sendName[0];
    }
    await this.archiveService.uploadFile(Data, this.authService.userId)
    this.reset();
  }

  /* GETTING CODE */

  getFiles(): Promise<Files[]> {
    return this.archiveService.getFileObject(this.userId, this.typeName);
  }

  reset() {
    this.getFiles().then( (files) => {
      this.files = files;

      const pageLength = Math.ceil(this.files.length/10);
      this.pages = [];

      for(let i = 0; i < pageLength; i++) {
        this.pages[i] = i;
      }

      this.checking()
    });
  }

  checking() {
    if( this.files.length != 0 ) {
      this.check = true;
    } else if ( this.files.length == 0) {
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
    this.showDelete = true;
    this.idFileDocument = id_file;
  }

  public async delete(idFile: number): Promise<void> {
    await this.archiveService.delete(idFile, this.folderName);
    this.reset();
    this.showMask = false;
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

  openDocument(currentIndex: number) {
    this.showMask = true;
    this.currentDocument = this.files[currentIndex];
  }

  closeDocument() {
    this.showMask = false;
  }

  prev(index: number) {
    if(index > 0) {
      this.currentDocument = this.files[index - 1];
      this.currentIndex = index - 1;

      if ( this.currentIndex == this.leftExtrem - 1 && this.pageIndex >= 1) {
        this.pageIndex = this.pageIndex - 1;
        this.changePage(this.pageIndex, "ArrowLeft");
      }
    }
  }

  next(index: number) {
    if(index < this.files.length - 1) {
      this.currentDocument = this.files[index + 1];
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
        this.openDelete(this.files[index].id_file)
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
