import { Component, Input, Output, EventEmitter, OnInit, DoCheck, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Movement } from 'src/app/models/Movement';
import { Note } from 'src/app/models/Note';
import { NotesService } from 'src/app/services/notes.service';

interface EditData{
  id_notes: number;
  title: string;
  text: string;
}

@Component({
  selector: 'app-modal-edit',
  templateUrl: './modal-edit.component.html',
  styleUrls: ['./modal-edit.component.css']
})
export class ModalEditComponent implements OnInit, DoCheck {

  @Input() formNoteData: Pick<Note, "title" | "text" | "id_notes">;
  @Input() formMovementData: Pick<Movement, "object" | "amount" | "id_movement">;
  @Input() isEdit = false;
  @Input() type: string;
  @Output() isEditChange = new EventEmitter();
  @Output() editResult = new EventEmitter();
  @ViewChild("formDirective") formDirective: NgForm;

  noteForm: FormGroup;
  formControl1 : FormControl<string | number>;
  formControl2 : FormControl<string | number>;
  check: boolean;

  constructor(private NotesService: NotesService) {}

  ngOnInit(): void {
    if ( this.type == "movements") {
      this.check = true;
    } else if ( this.type == "notes") {
      this.check = false;
    }
    this.noteForm = this.createFormGroup();
  }

  ngDoCheck() {
    if(this.isEdit == true)
    {
      this.noteForm = this.createFormGroup();
      this.isEdit = false;
    }
  }

  createFormGroup(): FormGroup {
    if( this.type == "movements" ) {

      return new FormGroup({
        object : this.formControl1 = new FormControl(`${this.formMovementData.object}`, [Validators.required, Validators.minLength(5)]),
        amount : this.formControl2 = new FormControl(`${this.formMovementData.amount}`, [Validators.required, Validators.minLength(0)])
      })
    } else {
      return new FormGroup({
        title : this.formControl1 = new FormControl(`${this.formNoteData.title}`, [Validators.required, Validators.minLength(5)]),
        text : this.formControl2 = new FormControl(`${this.formNoteData.text}`, [Validators.required, Validators.minLength(0)])
      })
    }
  }

  public async edit(param1: string | number, param2: string | number): Promise<void> {
    let editData;
    if( this.type == "movements") {
      editData = {
        object : param1,
        amount : param2,
        id_movement : this.formMovementData.id_movement
      }

    } else if ( this.type == "notes") {
      editData = {
        title : param1,
        text : param2,
        id_notes : this.formNoteData.id_notes
      }
    }


    this.editResult.emit(editData);
    this.closeEdit()
  }

  closeEdit() {
    const modelDiv = document.getElementById("modalEdit");
    if(modelDiv != null)
    {
      modelDiv.style.display = "none";
    }
    this.isEdit = false
    this.isEditChange.emit(this.isEdit);
    this.createFormGroup().reset();
    this.formDirective.resetForm();
  }

  resizeTextarea(event: Event) {
    let textarea = document.querySelector("textarea");
    let modalBlock = document.querySelector<HTMLElement>(".modalBlock");
    textarea.style.height= "64px";
    textarea = event.target as HTMLTextAreaElement;
    let scrHeight = textarea.scrollHeight;

    textarea.style.height= `${scrHeight + 4}px`;
    modalBlock.style.height = `calc(347 + ${scrHeight - 64}px)`;
  }

}

