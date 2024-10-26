import { Component, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { Product } from '../../../../core/models/ProductModel';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PedidoService } from '../../../../core/services/pedido.service';
import { FindOrder, PrintOrder } from '../../../../core/models/OrderModel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-modal-visualizar',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    ButtonModule,
    CheckboxModule,
    CommonModule,
    FormsModule,
    ProgressSpinnerModule
  ],
  templateUrl: './modal-visualizar.component.html',
  styleUrl: './modal-visualizar.component.scss'
})
export class ModalVisualizarComponent {
  visible: boolean = false;
  showModal = input(false)
  pedido_id = input<number>()
  close = output<void>();
  pedido!: FindOrder
  products!: Product[]
  comAssinatura:boolean = false

  private pedidoService = inject(PedidoService)

  ngOnChanges() {
    if (this.showModal() === true) {
      this.showDialog()
      if(this.pedido_id()){
        this.getPedido()
      }
    } else {
      this.closeDialog()
    }
  }
  showDialog() {
    this.visible = true;
  }

  getPedido(){
    const pedidoPayload = {pedido_id: this.pedido_id() || 0}
    this.pedidoService.localizar(pedidoPayload).subscribe({
      next: (res) => {
        this.pedido = res
        console.log(this.pedido)
      },
      error: (error) => {
        console.log('ERRO AO BUSCAR PEDIDO >> ', error)
      }
    })
    console.log('PEDIDO BUSCAR >> ', this.pedido_id())
  }

  vlrTotalProdutos(){
    return this.pedido.produtos.reduce((total, produto) => {
      const valorProduto = (produto.qntd * produto.vlr_uni) - produto.vlr_desc
      return total + valorProduto;
    }, 0)
  }

  imprimirPedido(){
    const infoPedido: PrintOrder = {
      pedido_id: this.pedido_id() || 0,
      assinatura: this.comAssinatura
    }
    this.pedidoService.gerarPDF(infoPedido).subscribe({
      next: (res: Blob) => {
        const blob = new Blob([res], { type: 'application/pdf' });
        const url = window.URL.createObjectURL(blob);
        window.open(url, '_blank');
        
      },
      error: (error) => {
        console.error('Erro ao imprimir etiqueta', error);
      }
    })

  }

  closeDialog() {
    this.visible = false;
    this.close.emit();
  }

  onHide() {
    this.closeDialog()
  }
}
