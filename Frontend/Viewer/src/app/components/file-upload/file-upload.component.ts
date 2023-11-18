import { Component, EventEmitter, OnInit, Output, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Files } from 'src/app/models/Files';
import { ArchiveService } from 'src/app/services/archive.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.css']
})
export class FileUploadComponent implements OnInit{

  @Input() formText: string;
  @Output() sendFormData = new EventEmitter<Pick<Files, "name" | "file">>()

  form: FormGroup;
  imageData: string;
  fileText: string;
  allowedFileTypes: [string, string, string];
  canGoOn = false;
  showNotAllowed = false;

  constructor(private archiveService: ArchiveService, private authService: AuthService) {}

  ngOnInit(): void {
    this.form = new FormGroup({
      name: new FormControl(null),
      file: new FormControl(null)
    });
    this.fileText = `Choose your ${this.formText}`
  }


  uploadFile(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ file: file });
    const labelSpan = document.getElementById("labelSpan");
    if(labelSpan != null)
    {
      labelSpan.style.color = "white";
    }
    this.fileText = file.name;
    if (this.formText == "image")
    {
      this.allowedFileTypes = ["image/png", "image/jpeg", "image/jpg"];
    } else if (this.formText == "document") {
      this.allowedFileTypes = ["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel"]
    } else if (this.formText == "track") {
      this.allowedFileTypes = ["audio/mpeg", "image/jpeg", "image/jpg"];
    }
    if ( file && this.allowedFileTypes.includes(file.type)) {
      this.canGoOn = true;
      const reader = new FileReader();
      reader.onload = () => {
        this.imageData = reader.result as string;
      }
      reader.readAsDataURL(file)
    } else {
      console.log(file.type + " / not allowed")
      this.showNotAllowed = true;
      this.resetForm();
    }
  }

  onSubmit(Data: Pick<Files, "name" | "file">) {
    if (this.canGoOn == true) {
      this.sendFormData.emit(Data);
    } else {
      console.log("File type not allowed : " + Data.file.type);
    }
    this.resetForm();
  }

  resetForm() {
    const labelSpan = document.getElementById("labelSpan");
    if(labelSpan != null)
    {
      labelSpan.style.color = "rgba(255, 255, 255, .5)";
    }
    this.fileText = `Choose your ${this.formText}`;
    this.form.reset();
    this.imageData = null;
  }

  closeWarning() {
    this.showNotAllowed = false;
  }

  keyListener(event: KeyboardEvent) {
    if ( event.key == "Escape") {
      this.closeWarning();
    }
  }
}
