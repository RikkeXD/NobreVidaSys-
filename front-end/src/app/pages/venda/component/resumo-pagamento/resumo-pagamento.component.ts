import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { PanelModule } from 'primeng/panel';
import { ProductSale } from '../../../../core/models/ProductModel';
import { PackingSale } from '../../../../core/models/PackingModel';
import { Payment } from '../../../../core/models/PaymentModel';
import { InputNumberModule } from 'primeng/inputnumber';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ValueOrder } from '../../../../core/models/ValueOrder';

@Component({
  selector: 'app-resumo-pagamento',
  standalone: true,
  imports: [
    PanelModule,
    InputNumberModule,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ],
  templateUrl: './resumo-pagamento.component.html',
  styleUrl: './resumo-pagamento.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResumoPagamentoComponent {

valorTotalProduto = input<number>()
valorEnvio = input<PackingSale>()
parcela = input<Omit<Payment,'nome'>>()
valorTotal: number = 0
desconto: number = 0
statusDesconto: boolean = false
valorParcela: number = 0
valorPedidoEmit = output<ValueOrder>()

ngOnInit(){
}

ngOnChanges(){
  this.calcularTotal()
}

calcularTotal(){
  if(!this.statusDesconto){this.desconto = 0}
  const totalProduto = this.valorTotalProduto() || 0
  const totalEnvio = this.valorEnvio()?.vlr_envio || 0 
  
  this.valorTotal = totalProduto + totalEnvio - this.desconto
  this.calcularParcela()
  this.emitirValor()
}

calcularParcela(){
  const qntdParcela = this.parcela()?.qntd_parcela || 0
  this.valorParcela = this.valorTotal / qntdParcela
}

emitirValor(){
  const valorPedido: ValueOrder = {
    vlr_total: this.valorTotal,
    vlr_desc: this.desconto
  }
  this.valorPedidoEmit.emit(valorPedido)
}

}
