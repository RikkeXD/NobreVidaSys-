import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, input, output } from '@angular/core';
import { DialogModule } from 'primeng/dialog';
import { PedidoService } from '../../../../core/services/pedido.service';
import { CheckShipping, Shipping } from '../../../../core/models/ShippingModel';
import { TableModule } from 'primeng/table';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { CommonModule } from '@angular/common';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-modal-select-envio',
  standalone: true,
  imports: [
    DialogModule,
    TableModule,
    ProgressSpinnerModule,
    CommonModule
  ],
  templateUrl: './modal-select-envio.component.html',
  styleUrl: './modal-select-envio.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalSelectEnvioComponent {
  isLoading: boolean = false
  visible: boolean = false;
  showModal = input(false)
  close = output<void>();
  clienteId = input<number>()
  embalagem_id = input<number>()
  peso = input<number>()
  fretes!: Shipping[]
  freteSelecionado!: Shipping
  freteEmit = output<Shipping>()
  infoEnvio!: CheckShipping

  private pedidoService = inject(PedidoService)
  private messageService = inject(MessageService)
  private cdr = inject(ChangeDetectorRef);


  ngOnChanges() {
    this.formatCheckShipping()
    if (this.showModal() === true) {
      this.showDialog()
    } else {
      this.closeDialog()
    }
  }

  showDialog() {
    if (!this.infoEnvio.cliente_id && !this.infoEnvio.embalagem_id && !this.infoEnvio.peso) {
      this.closeDialog()
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Erro ao abrir a janela, verifique os dados!"})
      return
    }
    this.consultarFrete()
    this.visible = true;
  }

  closeDialog() {
    this.visible = false;
    this.close.emit();
  }

  onHide() {
    this.closeDialog()
  }
  consultarFrete() {
    this.isLoading = true;
    this.pedidoService.consultarFrete(this.infoEnvio).subscribe({
      next: (res) => {
        this.fretes = res.map(item => ({
          nome: item.prazo_pex ? 'Pex' : item.prazo_sedex ? 'Pex - Sedex' : 'Pex - Pac',
          prazo: item.prazo_pex ?? item.prazo_sedex ?? item.prazo_pac,
          vlr_envio: parseFloat(((item.valor_pex ?? item.valor_sedex ?? item.valor_pac) || '0').replace(',', '.')),
          cod_rastreio: null
        }))
        this.isLoading = false;
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.error('Error ao consultar frete:', error)
        this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
        this.cdr.detectChanges()
      }
    })
  }
  selectFrete(frete: Shipping) {
    this.freteEmit.emit(this.freteSelecionado)
    this.closeDialog()
  }
  formatCheckShipping() {
    this.infoEnvio = {
      cliente_id: this.clienteId()!,
      embalagem_id: this.embalagem_id()!,
      peso: this.peso()!
    }
  }

}
