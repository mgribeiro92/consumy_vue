<script setup lang="ts">

import { Auth } from "@/auth"
import NavBar from './NavBar.vue'
import Cart from './Cart.vue'
import Message from "./Message.vue"
import Chat from "./Chat.vue"
import { orders } from '../orders'
import { chats } from '../chats'
import { onMounted, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchEventSource } from "@microsoft/fetch-event-source";

interface CartItem {
  product_id: number | undefined;
  title: string | undefined;
  amount: number;
  price: number | undefined;
  final_price: number;
  store_id: any;
  store_name: string
}

const auth = new Auth()
const orders_data = ref()
const show_cart = ref(false)
const cart = ref<CartItem[]>([])
const last_order = ref()
const order_id = ref()
const msg = ref()
const alert = ref()
const cart_quantity = ref()
const chat_info = ref()
const show_chat = ref(false)

const router = useRouter()
const route = useRoute()
const last_order_id = route.query.lastOrder;
console.log(last_order_id)


onMounted(() => {
  const cartItem = localStorage.getItem('cartItem')
  const cart = cartItem ? JSON.parse(cartItem) : []
  cart_quantity.value = cart.length
  allOrders()
})

async function allOrders() {
  if (last_order_id) {
    orders_data.value = await orders.getOrder(last_order_id)
    orders_data.value = [orders_data.value]
    order_id.value = orders_data.value[0].id
    connectionOrder()
  } else {
    orders_data.value = await orders.getOrders()
  }
}

function toggleCart(cart_length: any) {
  show_cart.value = !show_cart.value;
  console.log('fechando o cart')
  cart_quantity.value = cart_length
  console.log(cart_quantity.value)
}

async function orderAgain(order_id: any) {
  cart.value = []
  const order_data = await orders.getOrder(order_id)
  const order_items = order_data.order_items
  for(const order_item of order_items) {
    const cart_item = {
      product_id:  order_item.product.id,
      title: order_item.product.title,
      amount: order_item.amount,
      price: order_item.product.price,
      final_price: order_item.price,
      store_id: order_data.store_id,
      store_name: order_data.store_name
    }
    cart.value.push(cart_item);
  }
  console.log(cart.value)
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  show_cart.value = !show_cart.value
}

async function openChat(buyer_id: any, store_id: any) {
  console.log(buyer_id, store_id)
  console.log("abrir o chat")
  chat_info.value = await chats.createChat(buyer_id, store_id)
  show_chat.value = !show_chat.value
}

function closeChat() {
  console.log('closechat dos chats')
  show_chat.value = !show_chat.value
}

const getStatusClass = (state: string) => {
  return {
    payment_success: 'created',
    accepted: 'accepted',
    delivery: 'delivery',
    finished: 'finished',
    rejected: 'rejected',
    payment_failure: 'rejected'
  }[state];
};

function connectionOrder() {
  if (last_order_id) {
  const currentUser = auth.currentUser() 
  fetchEventSource (
    import.meta.env.VITE_BASE_URL + '/orders/' + last_order_id + '/status_order',{
      method: "GET",
      headers: {
        "Accept": "application/json",
        "X-API-KEY": import.meta.env.X_API_KEY,
        "Authorization": "Bearer" + ' ' + currentUser?.token
      },
      async onopen(response) {
        if (response.ok) {
          console.log('connected consumy!')
          return
        }
      },
      onmessage(message) {
        if (message.event === "new-status") {
          let data = JSON.parse(message.data)
          if (data.order) {
            console.log(data.order)
            msg.value = "Seu pedido teve uma atualização!"
            alert.value = "info"
            allOrders()
          }
        }
      },
    }
  )}
}

</script>


<template>

  <NavBar @cartClicked="toggleCart" :cart_quantity="cart_quantity"/>
  <div class="container">
    <Message v-show="msg" :message="msg" :alert="alert"/>
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
            <div @click="orderAgain(order.id)" class="order-again"><img src="../assets/repetir (1).png">   Bora pedir novo?</div>
            <div @click="openChat(order.buyer_id, order.store_id)" class="order-again"><img src="../assets/chat2.png">   Mandar mensagem para a loja!</div>
          </div>
          <div class="order-state">            
            <h6 id="created" v-if="order.state == 'payment_success' ">Pagamento finalizado, aguardando pedido ser aceito</h6>
            <h6 id="accepted" v-else-if="order.state == 'payment_failure' ">Pagamento recusado!</h6>
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
  <div v-if="show_chat" class="chat-wrapper">
    <Chat :chat_info="chat_info" @closeChat="closeChat"/>
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

  img {
    width: 20px;
    height: 20px;
  }

  .order-again{
    color: #808080;
    margin-bottom: 10px;
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