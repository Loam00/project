import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Movement } from 'src/app/models/Movement';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { PurseService } from 'src/app/services/purse.service';
import { Observable, first } from 'rxjs';

@Component({
  selector: 'app-purse',
  templateUrl: './purse.component.html',
  styleUrls: ['./purse.component.css']
})
export class PurseComponent implements OnInit{

  @ViewChild("formDirective") formDirective: NgForm;

  userId: Pick<User, "id_user">;
  idMovement: number;
  total: number;
  movements: Movement[];
  check = false;
  isOpen = false;
  isEdit = false;
  purseForm: FormGroup;
  editForm: FormGroup;

  constructor(private purseService: PurseService, private authService: AuthService) {};

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.movements = [];
    this.purseForm = this.createFormGroup();
    this.reset();
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      object: new FormControl("", [Validators.required, Validators.minLength(5)]),
      amount: new FormControl("", [Validators.required, Validators.minLength(0)])
    })
  }

  reset() {
    this.fetchMovements().then( (movements) => {
      this.movements = movements;
      this.checking()
    });
  }

  addMovement(purseData: Pick<Movement, "object" | "amount">): void {
    this.purseService.addMovement(purseData, this.authService.userId)
    .pipe(first()).subscribe( () => {
      this.createFormGroup().reset();
      this.formDirective.resetForm();
      this.reset();
    })
  }

  fetchMovements(): Promise<Movement[]> {
    return this.purseService.fetchMovements(this.userId);
  }

  checking() {
    if( this.movements.length != 0 ) {
      this.check = true;
    }
  }

  public async delete(movementId: number | Pick<Movement, "id_movement">): Promise<void> {
    await this.purseService.delete(movementId);
    this.reset();
  }

  createForm() {
    return this.editForm = this.createFormGroup();
  }

  public async edit(purseData: Pick<Movement, "object" | "amount">, movementId: number | Pick<Movement, "id_movement">): Promise<void> {
    await this.purseService.edit(purseData, movementId);
    this.createFormGroup().reset();
    this.formDirective.resetForm();
    this.reset();
  }

  openDelete(id_movement: number) {
    const modelDiv = document.getElementById("modalDelete");
    if(modelDiv != null)
    {
      modelDiv.style.display = "flex";
    }
    this.idMovement = id_movement;
    return this.idMovement
  }

  closeDelete() {
    const modelDiv = document.getElementById("modalDelete");
    if(modelDiv != null)
    {
      modelDiv.style.display = "none";
    }
  }

  openEdit(id_movement: number) {
    this.createForm();
    const modelDiv = document.getElementById("modalEdit");
    if(modelDiv != null)
    {
      modelDiv.style.display = "flex";
    }
    this.idMovement = id_movement;
    return this.idMovement;
  }

  closeEdit() {
    const modelDiv = document.getElementById("modalEdit");
    if(modelDiv != null)
    {
      modelDiv.style.display = "none";
    }
  }
}
