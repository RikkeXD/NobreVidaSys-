import { Component, inject, output } from '@angular/core';
import { SelectEmpresaComponent } from '../component/select-empresa/select-empresa.component';
import { EmpresasLista, Enterprise } from '../../../core/models/EnterpriseModel';
import { SelectClienteComponent } from '../component/select-cliente/select-cliente.component';
import { Client } from '../../../core/models/ClientModel';
import { SelectProdutoComponent } from '../component/select-produto/select-produto.component';
import { ProductSale } from '../../../core/models/ProductModel';
import { SelectFormaPagamentoComponent } from '../component/select-forma-pagamento/select-forma-pagamento.component';
import { Payment } from '../../../core/models/PaymentModel';
import { SelectEnvioComponent } from '../component/select-envio/select-envio.component';
import { OrderFinished, PackingSale } from '../../../core/models/PackingModel';
import { ResumoPagamentoComponent } from '../component/resumo-pagamento/resumo-pagamento.component';
import { Order } from '../../../core/models/OrderModel';
import { ValueOrder } from '../../../core/models/ValueOrder';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { PedidoService } from '../../../core/services/pedido.service';
import { ModalImprimirPedidoComponent } from '../component/modal-imprimir-pedido/modal-imprimir-pedido.component';

@Component({
  selector: 'app-criar-venda',
  standalone: true,
  imports: [
    SelectEmpresaComponent,
    SelectClienteComponent,
    SelectProdutoComponent,
    SelectFormaPagamentoComponent,
    SelectEnvioComponent,
    ResumoPagamentoComponent,
    ToastModule,
    ConfirmDialogModule,
    ModalImprimirPedidoComponent
  ],
  providers: [ConfirmationService],
  templateUrl: './criar-venda.component.html',
  styleUrl: './criar-venda.component.scss'
})
export class CriarVendaComponent {
  empresa!: Enterprise
  client!: Client | undefined
  EmpresaIdSelected!: number
  produto!: ProductSale[]
  pagamento!: Omit<Payment, 'nome'>
  totalPeso!: number
  envio!: PackingSale
  valorTotalProduto!: number
  pedido!: Order
  valorPedido!: ValueOrder
  showModal: boolean = false
  pedidoFinalizado!: OrderFinished 

  private messageService = inject(MessageService)
  private confirmationService = inject(ConfirmationService)
  private pedidoService = inject(PedidoService)

  atribuirEmpresa(empresa: Enterprise) {
    this.empresa = empresa
    this.EmpresaIdSelected = empresa.id
  }

  atribuirCliente(client: Client | undefined) {
    this.client = client
  }

  atribuirProduto(produto: ProductSale[]) {
    this.produto = produto
    this.valorTotalProduto = this.calcularTotalVenda()
  }

  atribuirPagamento(pagamento: Omit<Payment, 'nome'>) {
    this.pagamento = pagamento
  }

  atribuirPeso(peso: number) {
    this.totalPeso = peso
  }

  atribuirEnvio(envio: PackingSale) {
    this.envio = envio
  }

  atribuirValorPedido(valor: ValueOrder) {
    this.valorPedido = valor
  }

  calcularTotalVenda(): number {
    if (!this.produto || this.produto.length === 0) return 0;

    return this.produto.reduce((total, item) => {
      const valorComDesconto = item.qntd * item.vlr_uni - item.vlr_desc;
      return total + valorComDesconto;
    }, 0);
  }

  montarPedido() {
    
    if (!this.verificarPedido()) return
    this.pedido = {
      empresa_id: this.empresa.id,
      cliente_id: this.client!.id,
      pagamento: { id: this.pagamento.id, qntd_parcela: this.pagamento.qntd_parcela },
      embalagem_id: this.envio.embalagem_id,
      vlr_total: this.valorPedido.vlr_total,
      vlr_desc: this.valorPedido.vlr_desc || 0,
      envio: this.envio.nome,
      vlr_envio: this.envio.vlr_envio || 0,
      cod_rastreio: this.envio.cod_rastreio || null,
      produtos: this.produto
    }
  }
   verificarPedido() {
    if (!this.empresa?.id) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique a empresa"})
      return false;
    }

    if (!this.client?.id) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique o cliente"})
      return false;
    }

    if (!this.produto || this.produto.length === 0) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Adicione produtos ao pedido"})
      return false;
    }

    if(!this.verificarProdutos()){
      return false
    }

    if (!this.pagamento?.id) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique a forma de pagamento"})

      return false;
    }

    if(this.pagamento.id === 1 || this.pagamento.id === 2){
      if(this.pagamento.qntd_parcela! < 1){
        this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Selecione a quantidade de parcelas"})
        return false;
      }
    }

    if (!this.envio?.nome) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique o envio"})
      return false;
    }

    if (!this.envio?.embalagem_id) {
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Verifique a embalagem"})
      return false;
    }

    return true;
  }
  verificarProdutos(){
    const todosProdutosValidos = this.produto.every(produto => produto.qntd > 0);
    if(!todosProdutosValidos){
      this.messageService.add({severity: 'warn', summary: 'Atenção', detail: "Todos os produtos precisam ter uma quantidade maior que 0"})
      return false;
    }
    return true;
  }

  criarPedido(event: Event){
    if(!this.verificarPedido()){
      return
    }
    this.confirmationService.confirm({
        target: event.target as EventTarget,
        message: 'Deseja confirmar a criação do pedido?',
        header: 'Confirmação de criação do pedido',
        icon: 'pi pi-exclamation-triangle',
        acceptButtonStyleClass:"p-button-text p-button-text",
        rejectButtonStyleClass:"p-button-danger p-button-text",
        acceptLabel:'Sim',
        rejectLabel:'Não',
        accept: () => {
            this.montarPedido()
            // this.pedidoFinalizado = { pedido_id: 2, etiqueta: null }
            // if(this.pedidoFinalizado){
            //   this.modalImprimirPedido()
            // }
            this.pedidoService.criar(this.pedido).subscribe({
              next: (res) => {
                this.pedidoFinalizado = res
                this.modalImprimirPedido()
              },
              error: (error) => {
                this.messageService.add({severity: 'error', summary: 'Erro', detail: error.error.message})
              }
            })
        }
    })
}

modalImprimirPedido(){
  this.showModal = true
}

fecharModal() {
  this.showModal = false
}

}
