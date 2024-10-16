import { Component, inject, ViewEncapsulation } from '@angular/core';
import { TableModule } from 'primeng/table';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DropdownModule } from 'primeng/dropdown';
import { ButtonModule } from 'primeng/button';
import { Order, OrderList } from '../../../core/models/OrderModel';
import { UsuarioService } from '../../../core/services/usuario.service';
import { EmpresasLista } from '../../../core/models/EnterpriseModel';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { PedidoService } from '../../../core/services/pedido.service';
import { CommonModule } from '@angular/common';
import { ConfirmationService, MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { SplitButtonModule } from 'primeng/splitbutton';

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
    SplitButtonModule
  ],
  providers: [ConfirmationService],
  templateUrl: './lista-pedido.component.html',
  styleUrl: './lista-pedido.component.scss',
  encapsulation: ViewEncapsulation.None

})
export class ListaPedidoComponent {
  empresas!: EmpresasLista[]
  empresaIdSelected!: number
  selectedEmpresa!: EmpresasLista
  pedidos!: Order[]

  private usuarioService = inject(UsuarioService)
  private pedidoService = inject(PedidoService)
  private confirmationService = inject(ConfirmationService)

  ngOnInit() {
    this.usuarioService.listarEmpresa().subscribe((empresa) => {
      this.empresas = empresa.map(empresa => ({
        name: empresa.razao_social,
        code: empresa.id
      }))

      if (this.empresas.length > 0) {
        this.selectedEmpresa = this.empresas[0];
        this.empresaIdSelected = this.selectedEmpresa.code
        this.searchOrder()
      }
    })
  }

  searchOrder() {
    console.log('BUSCOU PEDIDO')
    this.pedidoService.listar(this.empresaIdSelected).subscribe({
      next: (res) => {
        this.pedidos = res
      },
      error: (error) => {
        console.error('Error ao listar pedidos:', error)
      }
    })
  }

  editPedido(pedido: Order) {

  }

  deletePedido(pedido: Order) {

  }

  empresaSelected(event: any) {
    this.empresaIdSelected = event.value.code
    this.searchOrder()
  }
  
  confirmarEntrega(pedido: any) {
    console.log('Confirmar Entrega:', pedido);
  }
  
  visualizarPedido(pedido: any) {
    console.log('Visualizar Pedido:', pedido);
  }

  getActionButtons(status: string, pedido: any): any[] {
    const actions: any[] = [];

    if (status === 'Criado') {
      actions.push(
        { label: 'Editar', icon: 'pi pi-pencil', command: () => this.editPedido(pedido) },
        { label: 'Excluir', icon: 'pi pi-trash', command: () => this.deletePedido(pedido) },
        { label: 'Confirmar Envio', icon: 'pi pi-send', command: () => this.deletePedido(pedido) }
      );
    } else if (status === 'Enviado') {
      actions.push(
        { label: 'Confirmar Entrega', icon: 'pi pi-check', command: () => this.deletePedido(pedido) }
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

private statusMessage(status: string): string{
  switch(status){
    case 'Enviado':
      return 'Deseja finalizar o pedido?'
    case 'Criado':
      return 'Deseja confirmar o envio do pedido?'
    default:
      return 'Status desconhecido'
  }
}
  atualizarPedido(event: MenuItemCommandEvent, pedido: OrderList){
    this.confirmationService.confirm({
        target: event.originalEvent?.target as EventTarget,
        message: this.statusMessage(pedido.status),
        header: 'Confirmação de atualização do pedido',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass:"p-button-text p-button-text",
        rejectButtonStyleClass:"p-button-danger p-button-text",
        acceptLabel:'Sim',
        rejectLabel:'Não',
        accept: () => {
            
        }
    })
}
}
