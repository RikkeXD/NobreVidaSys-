import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { ModalSelectProdutoComponent } from '../modal-select-produto/modal-select-produto.component';
import { Product, ProductSale } from '../../../../core/models/ProductModel';
import { TableModule } from 'primeng/table';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { TagModule } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { KeyFilterModule } from 'primeng/keyfilter';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-select-produto',
  standalone: true,
  imports: [
    PanelModule,
    ButtonModule,
    ModalSelectProdutoComponent,
    TableModule,
    CommonModule,
    InputTextModule,
    DropdownModule,
    FormsModule,
    TagModule,
    KeyFilterModule,
    InputNumberModule,
  ],

  templateUrl: './select-produto.component.html',
  styleUrl: './select-produto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectProdutoComponent {
  showModal: boolean = false
  empresaId = input<number>()
  products!: Product[]
  productSales: ProductSale[] = [];
  productEmit = output<ProductSale[]>()
  totalPesoEmit = output<number>()

  private messageService = inject(MessageService)

  ngOnChanges() {
    this.products = []
    this.productSales = []
  }
  emitirProduto() {
    this.productEmit.emit(this.productSales)
    this.atualizarTotalPeso()
  }

  abrirModal() {
    if (!this.empresaId()) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Selecione uma empresa"})
      return
    }
    this.showModal = true
  }
  fecharModal() {
    this.showModal = false
  }
  adicionarListaProduto(product: Product) {
    const listaProduto = Array.isArray(this.products) ? this.products : [];
    this.products = [...listaProduto, product]
    this.atualizarProductSales(product)
    this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Produto adicionado'})
  }

  atualizarProductSales(product: Product) {
    const productSale: ProductSale = {
      produto_id: product.id,
      qntd: 1,
      vlr_uni: 0,
      vlr_desc: 0,
      peso: Number(product.peso)
    }
    this.productSales = [...this.productSales, productSale];
    this.emitirProduto()
  }

  atualizarValoresProduto(index: number, field: keyof ProductSale, value: string) {
    const valueNumber = Number(value)
    this.productSales[index][field] = Number(value);
    if (field === 'qntd') {
      const produtoOriginal = this.products.find(p => p.id === this.productSales[index].produto_id);
      if (produtoOriginal) {
        this.productSales[index].peso = valueNumber * Number(produtoOriginal.peso);
      }
    }
    this.emitirProduto()
  }

  validarQuantidade(number: number): boolean {
    if (number === 0) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: 'Quantidade do produto invalída'})
      return true
    }
    return false
  }

  calcularTotal(): number {
    return this.productSales.reduce((total, productSale) => {
      const totalProduto = (productSale.qntd * productSale.vlr_uni) - productSale.vlr_desc;
      return total + totalProduto;
    }, 0);
  }

  atualizarTotalPeso() {
    const totalPeso = this.productSales.reduce((total, productSale) => {
      return total + productSale.peso;
    }, 0);

    this.totalPesoEmit.emit(totalPeso)
  }

  removerProduto(index: number) {
    if (index > -1) {
      this.products.splice(index, 1);
      this.productSales.splice(index, 1);
      this.emitirProduto();
      this.messageService.add({severity: 'success', summary: 'Sucesso', detail: 'Produto removido'})
    }
  }
}
