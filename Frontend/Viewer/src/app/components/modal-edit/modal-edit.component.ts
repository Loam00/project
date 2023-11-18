import { Component, Input, Output, EventEmitter, OnInit, DoCheck, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
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

  @Input() formData: Pick<Note, "title" | "text" | "id_notes">;
  @Input() isEdit = false;
  @Output() isEditChange = new EventEmitter();
  @Output() editResult = new EventEmitter();
  @ViewChild("formDirective") formDirective: NgForm;

  noteForm: FormGroup;

  constructor(private NotesService: NotesService) {}

  ngOnInit(): void {
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
    return new FormGroup({
      title : new FormControl(`${this.formData.title}`, [Validators.required, Validators.minLength(5)]),
      text : new FormControl(`${this.formData.text}`, [Validators.required, Validators.minLength(0)])
    })
  }

  public async edit(editNoteData: Pick<Note, "title" | "text">): Promise<void> {
    const editData = {
      title : editNoteData.title,
      text : editNoteData.text,
      id_notes : this.formData.id_notes
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

