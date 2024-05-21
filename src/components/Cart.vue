<script setup lang="ts">

import { ref, onMounted, onUpdated } from 'vue';

interface CartItem {
  product: number;
  title: string | undefined;
  quantity: number;
  price: number | undefined;
  final_price: number;
}

const cart = ref<CartItem[]>([]);
const price_formatted = ref()
const total_price = ref(0)


onMounted(() => {
  const cartItem = localStorage.getItem('cartItem');
  cart.value = cartItem ? JSON.parse(cartItem) : [];
  console.log(cart.value)
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

const emit = defineEmits(['cartClosed']);
const handleCartClose = () => {
  emit('cartClosed');
}

function sendOrder(){
  console.log('vamos mandar o pedido')
  console.log(cart.value)
}

function removeProduct(index: number) {
  console.log('product que vai ser removido', index)
  cart.value.splice(index, 1)
  console.log(cart.value)
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  recalculateTotalPrice()
}

</script>

<template>

  <div class="cart">
    <h3>Carrinho vazio</h3>
    <span v-if="!cart">Seu carrinho esta vazio, continue a comprar!</span>
    <div v-else v-for="product, index in cart">
      <div class="itens-cart">
        <p>{{ product.quantity }}x {{ product.title }}</p>
        <p>{{ product.final_price }}</p>
        <a>Editar</a>
        <button @click="removeProduct(index)">Remover</button>
      </div>
    </div>
    <p>{{ total_price }}</p>
    <div class="btn-row">
      <button class="btn-closed" @click="handleCartClose">Fechar</button>
      <button class="btn-finish" @click="sendOrder()">Finalizar Pedido</button>
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


</style>
