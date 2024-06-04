<script setup lang="ts">

import NavBar from './NavBar.vue'
import Cart from './Cart.vue'
import { Orders } from '../orders'
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

interface CartItem {
  product: number | undefined;
  title: string | undefined;
  quantity: number;
  price: number | undefined;
  final_price: number;
  store_id: any;
  store_name: string
}

const order =  new Orders()
const orders_data = ref()
const show_cart = ref(false)
const cart = ref<CartItem[]>([])
const last_order = ref()

const router = useRouter();
const showLastOrder = (router.currentRoute.value.query.showLastOrder == 'true')
console.log(showLastOrder)

onMounted(async () => {
  if (showLastOrder) {
    last_order.value = await order.getOrders()
    orders_data.value = last_order.value[0]
    orders_data.value = [orders_data.value]
  } else {
    orders_data.value = await order.getOrders()
  }
})

const toggleCart = () => {
  show_cart.value = !show_cart.value;
}

async function orderAgain(order_id: any) {
  cart.value = []
  const order_data = await order.getOrder(order_id)
  const order_items = order_data.order_items
  for(const order_item of order_items) {
    const cart_item = {
      product:  order_item.product.id,
      title: order_item.product.title,
      quantity: order_item.amount,
      price: order_item.product.price,
      final_price: order_item.price,
      store_id: order_data.store_id,
      store_name: order_data.store_name
    }
    cart.value.push(cart_item);
  }
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  show_cart.value = !show_cart.value
}


const getStatusClass = (state: string) => {
  return {
    created: 'created',
    accepted: 'accepted',
    delivery: 'delivery',
    finished: 'finished',
    rejected: 'rejected'
  }[state];
};

</script>


<template>

  <NavBar @cartClicked="toggleCart"/>
  <div class="container">
    <h2>Seus pedidos!</h2>
    <hr>    
    <div class="orders">
      <div v-for="order in orders_data" :key="order.id">
        <div class="card-order" :class="getStatusClass(order.state)">
          <div class="order-info">
            <h5>Pedido: {{ order.id }}</h5>
            <h6>Loja: {{ order.store_name }}</h6>
            <span>Itens do pedido: </span>
            <div v-for="order_item in order.order_items">
              <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.price }}</p>
            </div>
            <span @click="orderAgain(order.id)" class="order-again"><img src="../assets/repetir (1).png">   Bora pedir novo?</span>
          </div>
          <div class="order-state">            
            <h6 id="created" v-if="order.state == 'created' ">Aguardando pedido ser aceito</h6>
            <h6 id="accepted" v-else-if="order.state == 'accepted' ">Pedido aceito. Huum</h6>
            <h6 id="delivery" v-else-if="order.state == 'delivery' ">Pedido saiu para entrega. Yeaah</h6>
            <h6 id="finished" v-else-if="order.state == 'finished' ">Pedido finalizado :)</h6>
            <h6 id="rejected" v-else>Pedido rejeitado :(</h6>
            <p>Pedido criado em: {{ order.created_at }}</p>
            <p>Valor total do pedido: R$ {{ order.total }}</p>
          </div>
        </div>        
      </div>
    </div>    
  </div>

  <Cart v-if="show_cart" @cartClosed="toggleCart" />

</template>

<style>

  .orders {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  .card-order {
    margin: 10px 0px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    border-radius: 10px;
    padding: 10px;
  }

  .order-info {
    flex: 1;
  }

  .order-state {
    flex: 1;
    margin: 0px 10px;
  }

  img {
    width: 20px;
    height: 20px;
  }

  .order-again{
    color: #808080;
  }

  .order-again:hover {
    color: darkblue;
    cursor: pointer;
    text-decoration: underline;
  }

  #created {
    color: #ffd800;
    border-bottom: 1px solid #ffd800;
    text-align: center;
  }

  .card-order.created {
    border-left: 2px solid #ffd800;
    border-bottom: 2px solid #ffd800;
  }

  #accepted {
    color: #5968e0;
    border-bottom: 1px solid #5968e0;
    text-align: center;
  }

  .card-order.accepted {
    border-left: 2px solid #5968e0;
    border-bottom: 2px solid #5968e0;
  }

  #delivery {
    border-bottom: 1px solid #ed911f;
    color: #ed911f;
    text-align: center;
  }

  .card-order.delivery {
    border-left: 2px solid #ed911f;
    border-bottom: 2px solid #ed911f;
  }

  #finished {
    border-bottom: 1px solid #2ecc71;
    color: #2ecc71;
    text-align: center;
  }

  .card-order.finished {
    border-left: 2px solid #2ecc71;
    border-bottom: 2px solid #2ecc71;
  }

  #rejected {
		border-bottom: 1px solid #e11b16;
    color: #e11b16;
    text-align: center;
  }

  .card-order.rejected {
    border-left: 2px solid #e11b16;
    border-bottom: 2px solid #e11b16;
  }


</style>