<script setup lang="ts">

import { ref, onMounted, onUpdated, computed } from 'vue';
import { Orders } from '../orders'
import { stores } from '@/stores'
import { useRouter } from 'vue-router';
import ProductSelected from './ProductSelected.vue';
import CreditCard from './CreditCard.vue'

interface CartItem {
  product_id: number;
  title: string;
  amount: number;
  price: number;
  final_price: number;
  store_id: any;
  store_name: string;
}

const router = useRouter()
const order = new Orders()
const cart = ref<CartItem[]>([])
const total_price = ref(0)
const store = ref()
const product_id = ref()
const product_index = ref()
const order_in_progress = ref(false)
const show_card = ref(false)

onMounted(async () => {
  const cartItem = localStorage.getItem('cartItem')
  cart.value = cartItem ? JSON.parse(cartItem) : []
  recalculateTotalPrice()
  if(cart.value.length != 0) {
    store.value = cart.value[0].store_name
  }
})

function recalculateTotalPrice() {
  total_price.value = 0
  total_price.value = cart.value.reduce((acc, item) => acc + item.final_price, 0) 
}

const emit = defineEmits(['cartClosed', 'productUpdate']);
function handleCartClose() {
  emit('cartClosed');
}

function updateProduct(product: number, index: number) {
  console.log('produdo sendo atualizado')
  // emit('productUpdate', product)
  cart.value.splice(index, 1)
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  product_id.value = product
  product_index.value = index
}

async function newOrder(credit_card: JSON) {
  console.log('passando aqui na neworder')
  show_card.value = false
  order_in_progress.value = true
  console.log(credit_card)
  const store = cart.value[0].store_id
  const order_items = cart.value.map(item => ({ product_id: item.product_id, amount: item.amount }))
  const response_new_order = await order.createOrder(store, order_items)
  console.log(response_new_order)
  order.sendPayment(credit_card, response_new_order)
  localStorage.removeItem('cartItem')
  router.push({ path: '/orders', query: { lastOrder: response_new_order.id } });
}

function removeProduct(index: number) {
  console.log('produto retirado do carrinho')
  cart.value.splice(index, 1)
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  recalculateTotalPrice()
}

function formatarMoeda(valor: any) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
};

function handleShowCart() {
  console.log('Evento showCart foi acionado');
  const cartItem = localStorage.getItem('cartItem')
  cart.value = cartItem ? JSON.parse(cartItem) : []
  product_id.value = null
}

</script>

<template>

  <div v-if="!product_id && !order_in_progress && !show_card" class="modal">  
    <div class="modal-content"> 
      <div class="cart">
        <h3 style="text-align: center;">Carrinho</h3>
        <span v-if="cart.length == 0">Seu carrinho esta vazio, continue a comprar!</span>
        <div v-else>
          <h5>Loja:</h5>
          <h6>{{ store }}</h6>
          <h5>Produtos:</h5> 
          <div v-for="product, index in cart">         
            <div class="itens-cart">          
              <div class="itens">
                <div>{{ product.amount }}x {{ product.title }}</div>
                <div class="cart-price">{{  formatarMoeda(product.final_price) }}</div>
                <button class="btn-update" @click="updateProduct(product.product_id, index)">Editar</button>
                <button class="btn-remove" @click="removeProduct(index)">Remover</button>
              </div>
            </div>
          </div>
          <div v-show="cart.length != 0"><h5>Valor total: </h5>{{ formatarMoeda(total_price) }}</div>      
        </div>
        <div class="btn-row">
          <button class="btn-closed" @click="handleCartClose">Fechar</button>
          <button class="btn-finish" @click="show_card = true">Fazer Pagamento</button>
        </div>
      </div>
    </div>
  </div>

  <ProductSelected v-else-if="product_id" :product_id="product_id" :product_index="product_index" @showCart="handleShowCart"/>
  <CreditCard v-else-if="show_card" :total="total_price" @sendCreditCard="newOrder"/>

  <div v-else class="modal">
    <div class="modal-content"> 
      <h3>Pedido</h3>
      <div class="order-progress">
        <div class="loader"></div>
        <div>Aguardando pedido ser finalizado!</div> 
      </div>
    </div>
  </div>

</template>

<style scoped>

  .cart{
    display: flex;
    flex-direction: column;
    min-height: 200px;
  }

  .store-img {
    display: flex;
    margin-bottom: 10px;
  }

  .cart-img {
    width: 50px;
    height: 80px;
    flex: 43%;
    border-radius: 10px;
  }

  .cart-store {
    font-size: 25px;
    flex: 70%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .itens-cart{
    display: flex;
    flex-direction: column;
  }

  .cart-price {
    margin-left: 50px;
  }

  .itens {
    display: flex;
    align-items: center;
  }

  .order-progress {
    display: flex;
    align-items: center;
    gap: 30px;
    padding: 10px;
  }

  .loader {
    border: 8px solid #cccccc;
    border-top: 8px solid #8b0000;
    border-radius: 100%;
    width: 50px;
    height: 50px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg);}
    100% { transform: rotate(360deg);}    
  }

  .btn-row {
    display: flex;
    justify-content: center;
    gap: 10px;
    margin-top: auto;
  }

  .btn-closed {    
		padding: 0px 10px;
		margin: 0px 10px;  
		color: #8b0000;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
		border: 1px solid #8b0000;
	}

  .btn-closed:hover {
    color: white;
    background-color: #8b0000;
  }

  .btn-finish {    
		padding: 0px 10px;
		margin: 0px 10px;  
		color: #228b22;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
		border: 1px solid #228b22;
	}

  .btn-finish:hover {
    color: white;
    background-color: #228b22;
  }

  .btn-remove {
    color: grey;
    border: none;
    background-color: transparent;
    margin-left: 0px;
  }

  .btn-update {
    color: #8b0000;
    border: none;
    background-color: transparent;
    margin-left: auto;
  }


</style>
