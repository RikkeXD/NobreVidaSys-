import { Component, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import { OrderFinished } from '../../../../core/models/PackingModel';
import { PedidoService } from '../../../../core/services/pedido.service';
import { PrintOrder } from '../../../../core/models/OrderModel';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-imprimir-pedido',
  standalone: true,
  imports: [
    DialogModule,
    ButtonModule,
    CheckboxModule,
    FormsModule,
    
  ],
  templateUrl: './modal-imprimir-pedido.component.html',
  styleUrl: './modal-imprimir-pedido.component.scss'
})
export class ModalImprimirPedidoComponent {
  visible: boolean = false;
  showModal = input(false);
  close = output<void>();
  pedidoInput = input<OrderFinished>()
  etiquetaCriada = true
  comAssinatura: boolean = false

  private pedidoService = inject(PedidoService)
  private router = inject(Router)
  ngOnChanges() {
    if (this.showModal() === true) {
      this.showDialog()
    }
  }

  showDialog() {
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.close.emit();
    this.atualizaPagina();
  }

  onHide() {
    this.closeDialog()
  }

  atualizaPagina(){
    const currentUrl = this.router.url;
      this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
      });
  }

  imprimirEtiqueta() {
    const infoPedido: PrintOrder = {
      pedido_id: this.pedidoInput()?.pedido_id || 0,
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
        this.etiquetaCriada = false;
      }
    })
    this.etiquetaCriada = true;
  }
}
