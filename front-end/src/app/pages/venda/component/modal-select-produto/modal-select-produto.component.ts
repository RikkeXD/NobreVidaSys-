import { Component, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Product } from '../../../../core/models/ProductModel';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { ProductService } from '../../../../core/services/product.service';

@Component({
  selector: 'app-modal-select-produto',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    InputIconModule,
    IconFieldModule,
    InputTextModule
  ],
  templateUrl: './modal-select-produto.component.html',
  styleUrl: './modal-select-produto.component.scss'
})
export class ModalSelectProdutoComponent {
  visible: boolean = false;
  showModal = input(false)
  close = output<void>();

  empresaId = input<number>()
  produtos!: Product[]
  product!: Product
  productEmit = output<Product>()

  private productService = inject(ProductService)

  ngOnChanges() {
    if (this.showModal() === true) {
      this.showDialog()
      this.searchProduct()
    } else {
      this.closeDialog()
    }
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.close.emit();
  }

  onHide() {
    this.closeDialog()
  }

  selectProduct(product: Product){
    this.product = product
    this.productEmit.emit(product)
    this.closeDialog()
  }

  searchProduct(){
    this.productService.listar(this.empresaId()!).subscribe({
      next: (res: Product[]) => {
        this.produtos = res
      },
      error: (error) => {
        console.error('Error ao listar produtos:', error)
      }
    })
  }

}
