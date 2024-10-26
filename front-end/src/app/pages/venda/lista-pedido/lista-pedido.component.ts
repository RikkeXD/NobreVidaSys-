import { Component, inject, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Order, OrderList } from '../../../core/models/OrderModel';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EmpresasLista, UsuarioEmpresas } from '../../../core/models/EnterpriseModel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PedidoService } from '../../../core/services/pedido.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MenuItem, MenuItemCommandEvent, MessageService } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ModalVisualizarComponent } from './modal-visualizar/modal-visualizar.component';
import { CheckboxModule } from 'primeng/checkbox';
import { FloatLabelModule } from 'primeng/floatlabel';

@Component({
  selector: 'app-lista-pedido',
  standalone: true,
  imports: [
    TableModule,
    IconFieldModule,
    InputIconModule,
    DropdownModule,
    ButtonModule,
    FormsModule,
    InputTextModule,
    CommonModule,
    SplitButtonModule,
    ConfirmDialogModule,
    ModalVisualizarComponent,
    CheckboxModule,
    FloatLabelModule
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-pedido.component.html',
  styleUrl: './lista-pedido.component.scss',
})
export class ListaPedidoComponent {
  empresas!: EmpresasLista[]
  empresaIdSelected!: number
  selectedEmpresa: number = 0
  pedidos!: OrderList[]
  items!: MenuItem[];
  showModal: boolean = false
  pedido_id!: number
  inputRastreio: boolean = true
  cod_rastreio: string | null = null
  checkedInputRastreio: boolean = false

  private usuarioService = inject(UsuarioService)
  private pedidoService = inject(PedidoService)
  private confirmationService = inject(ConfirmationService)
  private messageService = inject(MessageService)

  ngOnInit() {

    this.usuarioService.listarEmpresa().subscribe((empresas) => {
      this.empresas = empresas.empresas.map(empresa => ({
          name: empresa.razao_social,
          code: empresa.id
      }))

      if (empresas.empresaPrincipalId) {
          this.selectedEmpresa = empresas.empresaPrincipalId
        } else {
          this.selectedEmpresa = this.empresas[0].code;
        }
        this.searchOrder()
  })
    
  }

  fecharModal() {
    this.showModal = false
  }

  abrirModal(pedido: number) {
    this.pedido_id = pedido
    this.showModal = true
  }

  searchOrder() {
    this.pedidos = []
    this.pedidoService.listar(this.selectedEmpresa).subscribe({
      next: (res) => {
        this.pedidos = res.map((pedido) => ({
          ...pedido,
          actions: this.getActionButtons(pedido.status!, pedido)
        }));
      },
      error: (error) => {
        this.pedidos = []
      }
    })
  }

  empresaSelected(event: any) {
    this.empresaIdSelected = +event.value.code
    this.searchOrder()
  }

  getActionButtons(status: string, pedido: OrderList): MenuItem[] {
    let actions: MenuItem[] = [];

    if (status === 'Criado') {
      actions.push(
        { label: 'Cancelar', icon: 'pi pi-trash', command: (event) => this.confirmarCancelamento(event,pedido.id) },
        { label: 'Confirmar Envio', icon: 'pi pi-send', command: (event) => this.confirmarAtualizacao(event, pedido) }
      );
    } else if (status === 'Enviado') {
      actions.push(
        { label: 'Confirmar Entrega', icon: 'pi pi-check', command: (event) => this.confirmarAtualizacao(event,pedido) }
      );
    }

    return actions;
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'Enviado':
        return 'status-enviado';
      case 'Criado':
        return 'status-criado';
      case 'Finalizado':
        return 'status-finalizado';
      case 'Cancelado':
        return 'status-cancelado';
      default:
        return '';
    }
  }

  private statusMessage(status: string): string {
    switch (status) {
      case 'Enviado':
        return 'Deseja finalizar o pedido?'
      case 'Criado':
        return 'Deseja confirmar o envio do pedido?'
      default:
        return 'Status desconhecido'
    }
  }
  confirmarAtualizacao(event: MenuItemCommandEvent, pedido: OrderList) {
    this.cod_rastreio = null
    if(pedido.cod_rastreio || pedido.status == 'Finalizado' || pedido.status == 'Enviado'){
      this.inputRastreio = false
    }else{
      this.inputRastreio = true
    }
    this.confirmationService.confirm({
      target: event.originalEvent?.target as EventTarget,
      message:  this.statusMessage(pedido.status),
      header: 'Confirmação de atualização do pedido',
      icon: 'pi pi-exclamation-triangle',
      acceptButtonStyleClass: "p-button-text p-button-text",
      rejectButtonStyleClass: "p-button-danger p-button-text",
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        const pedidoPayload = {pedido_id: pedido.id, cod_rastreio: this.cod_rastreio}
        this.pedidoService.atualizarPedido(pedidoPayload).subscribe({
          next: () => {
            this.searchOrder()
            this.messageService.add({ severity:'success', summary: 'Sucesso', detail: 'Status do pedido alterado com sucesso.' });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail:error.error.message });
            console.error('Error ao atualizar pedido:', error)
          }
        })
      }
    })
  }

  confirmarCancelamento(event: MenuItemCommandEvent, pedido_id: number) {
    this.inputRastreio = false
    this.confirmationService.confirm({
      target: event.originalEvent?.target as EventTarget,
      message: 'Deseja confirmar o Cancelamento do pedido ?',
      header: 'Confirmação de Cancelamento do pedido',
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: "p-button-text p-button-text",
      rejectButtonStyleClass: "p-button-danger p-button-text",
      acceptLabel: 'Sim',
      rejectLabel: 'Não',
      accept: () => {
        this.pedidoService.cancelarPedido(pedido_id).subscribe({
          next: () => {
            this.searchOrder()
            this.messageService.add({ severity:'success', summary: 'Sucesso', detail: 'Pedido cancelado com sucesso.' });
          },
          error: (error) => {
            this.messageService.add({ severity: 'error', summary: 'Erro', detail:error.error.message });
            console.error('Error ao atualizar pedido:', error)
          }
        })
      }
    })
  }

}
