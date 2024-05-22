<script setup lang="ts">

import NavBar from './NavBar.vue'
import { Order } from '../pedidos'
import { onMounted, ref } from 'vue';

const order =  new Order()
const orders_data = ref()

onMounted(async () => {
  orders_data.value = await order.getOrders()
  console.log(orders_data.value)
})

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

  <NavBar/>
  <div class="container">
    <h2>Seus pedidos!</h2>
    <hr>
    
    <div class="orders">
      <div v-for="order in orders_data">
        <div class="card-order" :class="getStatusClass(order.state)">
          <div class="order-info">
            <h5>Pedido: {{ order.id }}</h5>
            <h6>Loja: {{ order.store_name }}</h6>
            <span>Itens do pedido:</span>
            <div v-for="order_item in order.order_items">
              <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.product.price }}</p>
            </div>
          </div>
          <div class="order-state" >            
            <h6 id="created" v-if="order.state == 'created' ">Aguardando pedido ser aceito</h6>
            <h6 id="accepted" v-else-if="order.state == 'accepted' ">Pedido aceito. Huum</h6>
            <h6 id="delivery" v-else-if="order.state == 'delivery' ">Pedido saiu para entrega. Yeaah</h6>
            <h6 id="finished" v-else-if="order.state == 'finished' ">Pedido finalizado :)</h6>
            <h6 id="rejected" v-else>Pedido rejeitado :(</h6>
            <p>Pedido criado em: {{ order.created_at }}</p>
            <p>Valor total do pedido: {{ order.price }}</p>
          </div>
          
        </div>        
      </div>
    </div>    
  </div>

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