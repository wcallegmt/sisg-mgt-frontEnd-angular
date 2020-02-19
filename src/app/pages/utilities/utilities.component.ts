import { Component, OnInit } from '@angular/core';
import { BranchOfficeService } from '../../services/branch-office.service';
import { ExpenseService } from '../../services/expense.service';
import { UtilitieModel } from '../../models/utilitie.model';

@Component({
  selector: 'app-utilities',
  templateUrl: './utilities.component.html',
  styleUrls: ['./utilities.component.css']
})
export class UtilitiesComponent implements OnInit {

  dataUtilities: any[] = [];
  dataPattern: any[] = [];
  dataOfficeBranch: any[] = [];
  
  bodyUtilitie: UtilitieModel;

  showInactive = false;
  qBranch = '';
  qPartner = '';
  qLteUtilitie = 0;
  qGteUtilitie = 0;
  qEqUtilitie = 0;

  loading = false;
  loadData = false;
  titleModal = 'Nueva utilidad';
  textButton = 'Guardar';
  actionConfirm = 'eliminar';
  rowsForPage = 10;
  infoPagination = 'Mostrando 0 de 0 registros.';
  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  constructor(private branchSvc: BranchOfficeService, private expenseSvc: ExpenseService) { }

  ngOnInit() {

    this.bodyUtilitie = new UtilitieModel();

    this.branchSvc.onPartnetGetAll( '' ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }

      this.dataPattern = res.data;

    });

  }

  onChangePartner() {

    this.expenseSvc.onGetBranchByPartner( '', this.bodyUtilitie.idPartner ).subscribe( (res: any) => {
      if (!res.ok) {
        throw new Error( res.error );
      }
      this.dataOfficeBranch = res.data;
    });

  }


  ongetListUtilities( page: number, chk = false ) {

  }

  onEditUtilitie( id: number ) {

  }

  onShowConfirm() {

  }

  onSubmitUtilitie( frm: any ) {

  }

  onResetForm() {

  }

  onUpdateStatus() {

  }

}
