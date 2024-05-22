<script setup lang="ts">

import { ref, onMounted, onUpdated } from 'vue';
import { Order } from '../pedidos'
import { useRouter } from 'vue-router';

interface CartItem {
  product: number;
  title: string;
  quantity: number;
  price: number;
  final_price: number;
}

const router = useRouter()
const order = new Order()
const cart = ref<CartItem[]>([]);
const price_formatted = ref()
const total_price = ref(0)

onMounted(() => {
  const cartItem = localStorage.getItem('cartItem')
  cart.value = cartItem ? JSON.parse(cartItem) : []
  recalculateTotalPrice()
})

function recalculateTotalPrice() {
  total_price.value = 0
  total_price.value = cart.value.reduce((acc, item) => acc + item.final_price, 0);
  // for (const item of cart.value) {
  //   total_price.value += item.final_price 
  //   item.final_price = item.final_price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })  
  // } 
}

const emit = defineEmits(['cartClosed', 'productUpdate']);
function handleCartClose() {
  emit('cartClosed');
}

function updateProduct(product_id: number, index: number) {
  emit('productUpdate', product_id)
  cart.value.splice(index, 1)
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  console.log('updtte chmanado')
}

async function newOrder(){
  const response_new_order = await order.createOrder(cart.value)
  console.log(response_new_order)
  if(response_new_order.status == 200) {
    localStorage.removeItem('cartItem')
    handleCartClose()
    router.push('/orders')
  }

}

function removeProduct(index: number) {
  cart.value.splice(index, 1)
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  recalculateTotalPrice()
}

</script>

<template>

  <div class="cart">
    <h3>Carrinho</h3>
    <span v-if="!cart">Seu carrinho esta vazio, continue a comprar!</span>
    <div v-else v-for="product, index in cart">
      <div class="itens-cart">
        <p class="itens">{{ product.quantity }}x {{ product.title }}</p>
        <p>{{ product.final_price }}</p>
        <button class="btn-update" @click="updateProduct(product.product, index)">Editar</button>
        <button class="btn-remove" @click="removeProduct(index)">Remover</button>
      </div>
    </div>
    <p>{{ total_price }}</p>
    <div class="btn-row">
      <button class="btn-closed" @click="handleCartClose">Fechar</button>
      <button class="btn-finish" @click="newOrder()">Finalizar Pedido</button>
    </div>
  </div>
  

</template>

<style scoped>

  .cart{
    display: flex;
    flex-direction: column;
    min-height: 150px;
  }

  .itens-cart{
    display: flex;
    justify-content: space-between;
  }

  .itens {
    width: 250px;
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
  }

  .btn-update {
    color: #8b0000;
    border: none;
    background-color: transparent;
  }


</style>
