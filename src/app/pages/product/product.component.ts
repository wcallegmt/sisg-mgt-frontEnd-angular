import { Component, OnInit } from '@angular/core';
import { ProductModel } from 'src/app/models/product.model';
import { PagerService } from '../../services/pager.service';
import { ProductService } from '../../services/product.service';
import { UploadService } from '../../services/upload.service';
import { environment } from '../../../environments/environment';

const URI_IMG = environment.URI_API + '/Image/product/';
const TOKEN = localStorage.getItem('token');
@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  imgTypesValid = ['PNG', 'JPG', 'JPEG'];
  uriImg = URI_IMG;
  tokenUrl = TOKEN;
  bodyProduct: ProductModel;
  fileProduct: File = null;
  srcImage = './assets/vuexy/images/logo/no-image.jpg';
  dataProduct: any[] = [];
  actionConfirm = 'eliminar';
  titleModal = 'Nuevo producto';
  textButton = 'Guardar';
  infoPagination = 'Mostrando 0 de 0 registros';
  showInactive = false;
  loading = false;
  loadingTable = false;
  loadImg = false;
  loadData = false;
  imgValid = true;
  rowsForPage = 10;
  qProduct = '';
  qPatent = '2';
  qGtePercent = 0; // mayor
  qLtePercent = 0; // menor
  qEqPercent = 0; // igual

  pagination = {
    currentPage : 0,
    pages : [],
    totalPages: 0
  };
  constructor( private pagerSvc: PagerService, private productSvc: ProductService, private uploadSvc: UploadService ) { }

  ngOnInit() {
    this.bodyProduct = new ProductModel();
    this.onGetListProduct(1);
  }

  onGetListProduct(page, chk = false) {
    if (chk) {
      this.showInactive = !this.showInactive;
      this.actionConfirm = this.showInactive ? 'restaurar' : 'eliminar';
    }
    this.loadingTable = true;
    this.productSvc.onGetProduct( page, this.rowsForPage, this.qProduct, this.qPatent, this.qGtePercent, this.qLtePercent, this.qEqPercent, this.showInactive ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      this.dataProduct = res.data;

      this.pagination = this.pagerSvc.getPager(res.dataPagination.total, page, this.rowsForPage);

      if ( this.pagination.totalPages > 0 ) {

        const start = ((this.pagination.currentPage - 1) * this.rowsForPage) + 1;
        const end = ((this.pagination.currentPage - 1) * this.rowsForPage) + this.dataProduct.length;
        this.infoPagination = `Mostrando del ${ start } al ${ end } de ${ res.dataPagination.total } registros.`;
        this.loadingTable = false;
      }
    });
  }

  onChangeImg( file: FileList ) {
    this.fileProduct = file.item(0);
    const nombre = (file.item(0).name).toUpperCase();
    let arrNombre = nombre.split('.');
    arrNombre = [ arrNombre[ arrNombre.length - 1 ] ];

    if (this.imgTypesValid.indexOf( arrNombre[0] ) < 0) {
      this.imgValid = false;
      return;
    }

    this.loadImg = true;
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.srcImage = event.target.result;
      this.loadImg = false;
      this.imgValid = true;
    };
    reader.readAsDataURL(this.fileProduct);
  }

  onEditProduct( idproduct: number ) {
    const dataTemp = this.dataProduct.find( element => element.idProducto === idproduct );

    if ( ! dataTemp ) {
      throw new Error('No se encontró producto');
    }

    this.bodyProduct.idProduct = dataTemp.idProducto;
    this.bodyProduct.nameProduct = dataTemp.nombreProducto;
    this.bodyProduct.category = dataTemp.categoriaProducto || 'SPORTS';
    this.bodyProduct.havePatent = dataTemp.tienePatente;
    this.bodyProduct.patentPercent = dataTemp.porcentajePatente;
    this.bodyProduct.descriptionProduct = dataTemp.descripcionProducto || '';
    this.srcImage = URI_IMG + dataTemp.imagen + `?token=${ localStorage.getItem('token') }`;

    this.loadData = true;
    this.titleModal = 'Editar producto';
    this.textButton = 'Guardar cambios';
    $('#btnShowModalProduct').trigger('click');
  }

  onShowConfirm( idproduct: number ) {
    const dataTemp = this.dataProduct.find( element => element.idProducto === idproduct );

    if ( ! dataTemp ) {
      throw new Error('No se encontró producto');
    }

    this.bodyProduct.idProduct = dataTemp.idProducto;
    this.bodyProduct.statusRegister = !dataTemp.estadoRegistro;
  }

  onResetForm() {
    $('#frmProduct').trigger('reset');
    this.bodyProduct = new ProductModel();

    this.bodyProduct.category = '';

    this.loadData = false;
    this.fileProduct = null;
    this.titleModal = 'Nuevo producto';
    this.textButton = 'Guardar';
    this.srcImage = './assets/vuexy/images/logo/no-image.jpg';
    $('#alertProductModal').html('');
  }

  onSubmitProduct( event ) {
    this.loading = true;
    if (event.valid) {

      if (!this.loadData) {
        this.productSvc.onAddProduct( this.bodyProduct ).subscribe( async (res: any) => {
          if (!res) {
            throw Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            if (this.fileProduct !== null) {
              await this.onUploadFileProduct( res.data.idProducto );
            }

            $('#btnCloseModalProduct').trigger('click');
            // this.onResetForm();
            this.onGetListProduct(1);
          }
          this.loading = false;
        });
      } else {
        this.productSvc.onUpdateproduct( this.bodyProduct ).subscribe( async (res: any) => {
          if (!res) {
            throw Error( res.error );
          }

          const { message, css, idComponent } = this.onGetErrors( res.data.showError );
          this.onShowAlert(message, css, idComponent);

          if ( res.data.showError === 0) {
            if (this.fileProduct !== null) {
              await this.onUploadFileProduct( this.bodyProduct.idProduct );
            }

            $('#btnCloseModalProduct').trigger('click');
            // this.onResetForm();
            this.onGetListProduct(1);
          }
          this.loading = false;


        });
      }
    }

  }

  onUploadFileProduct( idProduct: number ): Promise<boolean> {
    return new Promise( (resolve) => {
      this.uploadSvc.onUploadImg( 'product', idProduct, this.fileProduct ).subscribe( (res: any) => {
        if (!res) {
          throw new Error( res.error );
        }
  
        console.log(res);
        resolve( true );
      });
    });
  }

  onUpdateStatus() {
    this.loading = true;
    this.productSvc.onDeleteProduct( this.bodyProduct.idProduct, this.bodyProduct.statusRegister ).subscribe( (res: any) => {
      if ( !res.ok ) {
        throw new Error( res.error );
      }

      const { message, css } = this.onGetErrors( res.data.showError );
      this.onShowAlert(message, css, 'alertProductTable');

      if ( res.data.showError === 0) {
        this.onShowAlert(`Se ${ this.showInactive ? 'restauró' : 'eliminó' } un producto con éxito`, css);
        this.onResetForm();
        this.onGetListProduct(1);
      }
      $('#btnCloseConfirmProduct').trigger('click');
      this.loading = false;

    });
  }

  onShowAlert( msg = '', css = 'success', idComponent = 'alertProductTable' ) {

    let htmlAlert = `<div class="alert alert-${ css } alert-dismissible fade show" role="alert">`;
    htmlAlert += `<i class="feather icon-info mr-1 align-middle"></i>`;
    htmlAlert += msg;
    htmlAlert += `<button type="button" class="close" data-dismiss="alert" aria-label="Close">`;
    htmlAlert += `<span aria-hidden="true"><i class="feather icon-x-circle"></i></span>`;
    htmlAlert += `</button>`;
    htmlAlert += `</div>`;
    htmlAlert += ``;

    $(`#${ idComponent }`).html(htmlAlert);
  }

  onGetErrors( showError: number ) {
    const action = this.loadData ? 'actualizó' : 'agregó';
    let arrErrors = showError === 0 ? [`Se ${ action } un producto con éxito`] : ['Ya existe'];
    const css = showError === 0 ? 'success' : 'danger';
    const idComponent = showError === 0 ? 'alertProductTable' : 'alertProductModal';
    // tslint:disable-next-line: no-bitwise
    if ( showError & 1 ) {
      arrErrors.push('un registro con este nombre');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 2 ) {
      arrErrors.push('se encuentra inactivo');
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 4 ) {
      arrErrors = ['No existe la empresa especificada'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 8 ) {
      arrErrors = ['No se encontró registro del producto'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 16 ) {
      arrErrors = ['Existen comisiones asociadas a este producto en responsables, elimine comisión'];
    }

    // tslint:disable-next-line: no-bitwise
    if ( showError & 32 ) {
      arrErrors = ['Existen comisiones asociadas a este producto en sucursales, elimine comisión'];
    }

    return { message: arrErrors.join(', '), css, idComponent };

  }

}
