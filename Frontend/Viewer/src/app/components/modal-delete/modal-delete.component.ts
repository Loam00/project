import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-modal-delete',
  templateUrl: './modal-delete.component.html',
  styleUrls: ['./modal-delete.component.css']
})
export class ModalDeleteComponent {

  @Input() idFile: number;
  @Input() isDelete: boolean;
  @Output() isDeleteChange = new EventEmitter<boolean>();
  @Output() idDelete = new EventEmitter<number>()

    public async delete(idFile: number): Promise<void> {
      this.idDelete.emit(idFile);
      this.closeDelete()
    }

    closeDelete() {
      const modelDiv = document.getElementById("modalDelete");
      if(modelDiv != null)
      {
        modelDiv.style.display = "none";
      }
      this.isDelete = false;
      this.isDeleteChange.emit(this.isDelete);
    }

    keyListener(idFile: number, event: KeyboardEvent) {
      if(this.isDelete == true) {
        if (event.key == "Enter") {
          this.delete(idFile);
        } else if ( event.key == "Escape") {
          this.closeDelete();
        }
      }
    }
}
