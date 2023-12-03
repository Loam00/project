import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Movement } from 'src/app/models/Movement';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';
import { PurseService } from 'src/app/services/purse.service';

@Component({
  selector: 'app-purse',
  templateUrl: './purse.component.html',
  styleUrls: ['./purse.component.css']
})
export class PurseComponent implements OnInit{
  @ViewChild("formDirective") formDirective: NgForm;

  showMask = false;
  movements: Movement[];
  movementForm: FormGroup;
  editForm: Pick<Movement, "object" | "amount" | "id_movement"> = {object: "", amount: 0, id_movement: 0};
  collapsed = false;
  isOpen = false;
  showEdit = false;
  showDelete = false;
  check = false;
  selected: boolean;
  idMovements: number;
  idFileMovement: number;
  userId: Pick<User, "id_user"> | number;
  scrHeight: number;
  pages: number[];
  leftExtrem = 0;
  rightExtrem = 9;
  currentMovement: Movement;
  currentIndex: number;
  pageIndex = 0;
  editType = "movements";
  total: number;
  income: number[];
  outcome: number[];
  totalIncome: number;
  totalOutcome: number;
  currentIncomeState: boolean;
  positive: boolean;

  constructor(private PurseService: PurseService, private authService: AuthService) {};

  ngOnInit(): void {
    this.userId = this.authService.userId;
    this.movements = [];
    this.income = [];
    this.outcome = [];
    this.pages = [];
    this.total = 0;
    this.totalIncome = 0;
    this.totalOutcome = 0;
    this.reset();
    this.currentMovement = this.movements[0];
  }

  openMovementForm() {
    this.isOpen = !this.isOpen;
    this.collapsed = !this.collapsed;
    this.movementForm = this.createFormGroup();

    const wrapper = document.getElementById("formMovements");
    let wrapperNotes = document.querySelector<HTMLElement>(".wrapperMovements");

    if(this.collapsed == false) {
      wrapper.style.height = `181px`;
      wrapperNotes.style.height = "calc(100vh - 241px)"
      this.createFormGroup().reset();
    } else if(this.collapsed == true) {
      wrapper.style.height = "430px";
    }
  }

  createFormGroup(): FormGroup {
    return new FormGroup({
      object : new FormControl("", [Validators.required, Validators.minLength(5)]),
      amount : new FormControl("", [Validators.required, Validators.minLength(0)])
    })
  }

  public async createMovement(movementData: Pick<Movement, "object" | "amount">):  Promise<void> {

    await this.PurseService.addMovement(movementData, this.authService.userId);

    this.createFormGroup().reset();
    this.formDirective.resetForm();
    this.reset();

    const wrapper = document.getElementById("formMovements");
    let wrapperNotes = document.querySelector<HTMLElement>(".wrapperMovements");

    this.isOpen = !this.isOpen;
    this.collapsed = !this.collapsed;

    wrapper.style.height = `181px`;
    wrapperNotes.style.height = "calc(100vh - 241px)"
  };

  fetchMovements(): Promise<Movement[]> {
    return this.PurseService.fetchMovements(this.userId);
  }

  checking() {
    if( this.movements.length != 0 ) {
      this.check = true;
    } else if ( this.movements.length == 0) {
      this.check = false;
    }
  }

  reset() {
    this.fetchMovements().then( (movements) => {
      this.movements = movements;

      const pageLength = Math.ceil(this.movements.length/10);
      this.total = 0;
      this.totalIncome = 0;
      this.totalOutcome = 0;
      let i = 0;
      let j = 0;
      this.movements.forEach( movement => {
        if ( movement.amount > 0) {
          i++;
          this.income.length = i;
          this.income[i-1] = movement.amount;
          this.totalIncome = this.totalIncome + movement.amount;
          movement.income = true;
        } else if ( movement.amount < 0) {
          j++;
          this.income.length = j;
          this.income[j-1] = movement.amount;
          this.totalOutcome = this.totalOutcome + movement.amount;
          movement.income = false;
        }

        this.total = this.total + movement.amount;
      });

      this.total = Number(this.total.toFixed(2));
      if (this.total >= 0) {
        this.positive = true;
      } else {
        this.positive = false;
      }
      this.totalIncome = Number(this.totalIncome.toFixed(2));
      this.totalOutcome = Number(this.totalOutcome.toFixed(2));

      this.pages = [];

      for(let i = 0; i < pageLength; i++) {
        this.pages[i] = i;
      }
      this.checking()

      if( this.movements.length == 0) {
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
    this.idFileMovement = id_file;
    this.showDelete = true;
  }

  public async delete(idFile: number): Promise<void> {
    await this.PurseService.delete(idFile);

    if(this.currentIndex != 0)
    {
      console.log("sono nel primo if")
      this.currentMovement = this.movements[this.currentIndex - 1];
      this.currentIndex = this.currentIndex - 1;
      this.currentIncomeState = this.currentMovement.income;
    }

    this.reset();
    console.log(this.movements.length)
    if( this.movements.length == 0) {
      this.showMask = false;
    }
  }

  /* EDIT CODE */

  openEdit(movementData: Movement) {

    this.editForm.object = movementData.object;
    this.editForm.amount = movementData.amount;
    this.editForm.id_movement = movementData.id_movement;
    console.log(this.editForm)

    const modelDiv = document.getElementById("modalEdit");

    if(modelDiv != null)
    {
      modelDiv.style.display = "flex";
    }

    this.showEdit = true;
  }

  public async edit(movementData: Pick<Movement, "object" | "amount" | "id_movement">): Promise<void> {
    console.log(movementData)
    await this.PurseService.edit(movementData);
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

  openMovement(index: number) {
    this.showMask = true;
    index = index + ( this.pageIndex * 10 );
    this.currentIndex = index;
    this.currentMovement = this.movements[index];
    this.currentIncomeState = this.currentMovement.income;
  }

  closeMovement() {
    this.showMask = false;
  }

  prev(index: number) {
    if(index > 0) {
      this.currentMovement = this.movements[index - 1];
      this.currentIndex = index - 1;
      this.currentIncomeState = this.currentMovement.income;

      if ( this.currentIndex == this.leftExtrem - 1 && this.pageIndex >= 1) {
        this.pageIndex = this.pageIndex - 1;
        this.changePage(this.pageIndex, "ArrowLeft");
      }
    }
  }

  next(index: number) {
    if(index < this.movements.length - 1) {
      this.currentMovement = this.movements[index + 1];
      this.currentIndex = index + 1;
      this.currentIncomeState = this.currentMovement.income;

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
        this.openDelete(this.movements[index].id_movement)
      } else if (event.key == "Escape") {
        this.showMask = false;
      } else if (event.key == "Enter") {
        this.openEdit(this.movements[index]);
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
