import { Component, OnInit, HostListener} from '@angular/core';
import { FormControl, FormGroup, Validators, NgForm } from '@angular/forms';
import { first } from 'rxjs';
import { Note } from 'src/app/models/Note';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { NotesService } from 'src/app/services/notes.service';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})
export class NotesComponent implements OnInit {
  @ViewChild("formDirective") formDirective: NgForm;

  showMask = false;
  notes: Note[];
  noteForm: FormGroup;
  editForm: Pick<Note, "title" | "text" | "id_notes"> = {title: "", text: "", id_notes: 0};
  collapsed = false;
  isOpen = false;
  showEdit = false;
  showDelete = false;
  check = false;
  selected: boolean;
  idNotes: number;
  idFileNote: number;
  userId: Pick<User, "id_user"> | number;
  scrHeight: number;
  pages: number[];
  leftExtrem = 0;
  rightExtrem = 9;
  currentNote: Note;
  currentIndex: number;
  pageIndex = 0;

  constructor(private NotesService: NotesService, private authService: AuthService) {};

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.notes = [];
    this.pages = [];
    this.reset();
  }

  openNoteForm() {
    this.isOpen = !this.isOpen;
    this.collapsed = !this.collapsed;
    this.noteForm = this.createFormGroup();

    const wrapper = document.getElementById("formNotes");
    let wrapperNotes = document.querySelector<HTMLElement>(".wrapperNotes");

    if(this.collapsed == false) {
      wrapper.style.height = `181px`;
      wrapperNotes.style.height = "calc(100vh - 241px)"
      this.createFormGroup().reset();
    } else if(this.collapsed == true) {
      wrapper.style.height = "430px";
    }
  }

  resizeTextarea(event: Event) {
    let textarea = document.querySelector("textarea");

    let wrapperNotes = document.querySelector<HTMLElement>(".wrapperNotes");
    const wrapper = document.getElementById("formNotes");
    textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = "64px";
    this.scrHeight = textarea.scrollHeight;

    if(this.collapsed == true) {
      textarea.style.height= `${this.scrHeight + 4}px`;

      if( this.scrHeight <= 180) {
        wrapper.style.height = `calc(434px + ${this.scrHeight - 64}px)`;
        wrapperNotes.style.height = `calc(100% - ${this.scrHeight + 490 - 64}px)`;
      }
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      title : new FormControl("", [Validators.required, Validators.minLength(5)]),
      text : new FormControl("", [Validators.required, Validators.minLength(0)])
    })
  }

  public async createNote(noteData: Pick<Note, "title" | "text">):  Promise<void> {

    await this.NotesService.createNote(noteData, this.authService.userId);

    this.createFormGroup().reset();
    this.formDirective.resetForm();
    this.reset();

    let textarea = document.querySelector("textarea");
    const wrapper = document.getElementById("formNotes");
    let wrapperNotes = document.querySelector<HTMLElement>(".wrapperNotes");

    textarea.style.height= "64px";

    this.isOpen = !this.isOpen;
    this.collapsed = !this.collapsed;

    wrapper.style.height = `181px`;
    wrapperNotes.style.height = "calc(100vh - 241px)"
  };

  fetchNotes(): Promise<Note[]> {
    return this.NotesService.fetchNotes(this.userId);
  }

  checking() {
    if( this.notes.length != 0 ) {
      this.check = true;
    } else if ( this.notes.length == 0) {
      this.check = false;
    }
  }

  reset() {
    this.fetchNotes().then( (notes) => {
      this.notes = notes;
      const pageLength = Math.ceil(this.notes.length/10);
      this.pages = [];

      for(let i = 0; i < pageLength; i++) {
        this.pages[i] = i;
      }
      this.checking()

      if( this.notes.length == 0) {
        this.showMask = false;
      }
    });
  }

  /* DELETE CODE */

  async openDelete(id_file: number) {
    const modelDiv = document.getElementById("modalDelete");
    if(modelDiv != null)
    {
      modelDiv.style.display = "flex";
    }
    this.idFileNote = id_file;
    this.showDelete = true;
  }

  public async delete(idFile: number): Promise<void> {
    await this.NotesService.delete(idFile);

    if(this.currentIndex != 0)
    {
      this.currentNote = this.notes[this.currentIndex - 1];
      this.currentIndex = this.currentIndex - 1;
    } else {
      this.currentNote = this.notes[this.currentIndex + 1];
    }
    this.reset();
  }

  /* EDIT CODE */

  openEdit(noteData: Note) {

    this.editForm.title = noteData.title;
    this.editForm.text = noteData.text;
    this.editForm.id_notes = noteData.id_notes;
    console.log(this.editForm)

    const modelDiv = document.getElementById("modalEdit");

    if(modelDiv != null)
    {
      modelDiv.style.display = "flex";
    }

    this.showEdit = true;

  }

  public async edit(noteData: Pick<Note, "title" | "text" | "id_notes">): Promise<void> {
    console.log(noteData)
    await this.NotesService.edit(noteData);
    this.reset();
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

  /* OPEN NOTE AND NAVIGATION */

  openNote(index: number) {
    this.showMask = true;
    index = index + ( this.pageIndex * 10 );
    this.currentIndex = index;
    this.currentNote = this.notes[index];
  }

  closeNote() {
    this.showMask = false;
  }

  prev(index: number) {
    if(index > 0) {
      this.currentNote = this.notes[index - 1];
      this.currentIndex = index - 1;

      if ( this.currentIndex == this.leftExtrem - 1 && this.pageIndex >= 1) {
        this.pageIndex = this.pageIndex - 1;
        this.changePage(this.pageIndex, "ArrowLeft");
      }
    }
  }

  next(index: number) {
    if(index < this.notes.length - 1) {
      this.currentNote = this.notes[index + 1];
      this.currentIndex = index + 1;

      if ( this.currentIndex == this.rightExtrem + 1 && this.pageIndex < this.pages.length - 1) {
        this.pageIndex = this.pageIndex + 1;
        this.changePage(this.pageIndex, "ArrowRight");
      }
    }
  }

  keyListener(index: number, event: KeyboardEvent) {
    if( this.showEdit == false && this.showDelete == false && this.showMask == true ){
      if(event.key == "ArrowRight") {
        this.next(index);
      } else if (event.key == "ArrowLeft") {
        this.prev(index);
      } else if (event.key == "Delete") {
        this.openDelete(this.notes[index].id_notes)
      } else if (event.key == "Escape") {
        this.showMask = false;
      } else if (event.key == "Enter") {
        this.openEdit(this.notes[index]);
      }
    } else if ( this.showEdit == false && this.showDelete == false && this.showMask == false ) {
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
}
