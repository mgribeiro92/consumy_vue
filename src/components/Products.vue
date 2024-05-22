<script setup lang="ts">

import { ref, onMounted, computed, onUpdated } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { products } from '@/products';
import { stores } from '@/stores'
import Cart from './Cart.vue'
import NavBar from './NavBar.vue';
import Message from './Message.vue';

interface Product {
  title: string,
  price: number,
  image_url: string,
  id: number
}

interface CartItem {
  product: number | undefined;
  title: string | undefined;
  quantity: number;
  price: number | undefined;
  final_price: number;
  store_id: any;
}

const product_quantity = ref<number>(1)
const product_price = ref()
const products_data = ref<Product[]>([])
const store = ref({ id: 0, name: '', created_at: '', updated_at: '', image_url: '', products: [], update_at: '', url: '' });
const route = useRoute()
const store_id = route.params.storeId
const localhost = import.meta.env.VITE_BASE_URL
const show_cart = ref(false)
const product_clicked = ref(false)
const product_selected = ref<Product>()
// const cart = ref([])
const cart = ref<CartItem[]>([]);

const product_final_price = computed(() => product_quantity.value * product_price.value)
const msg = ref('')
const alert = ref('')

onMounted(async () => {
  products_data.value = await products.getProducts(store_id)
  store.value = await stores.getStore(store_id)
  const cartItem = localStorage.getItem('cartItem')
  cart.value = cartItem ? JSON.parse(cartItem) : []
})

onUpdated(() => {
  const cartItem = localStorage.getItem('cartItem')
  cart.value = cartItem ? JSON.parse(cartItem) : []
})

function toggleCart() {
  show_cart.value = !show_cart.value;
}

function showProductUpdate(product_id: number) {
  show_cart.value = !show_cart.value;
  product_clicked.value = !product_clicked.value;
  productClicked(product_id)
}

function productClicked(product_id: number) {
  product_clicked.value = true
  product_selected.value = products_data.value.find(product => product.id === product_id)
  product_price.value = product_selected.value?.price
}

function mandarProduto() {
  const cart_item = {
    product: product_selected.value?.id,
    title: product_selected.value?.title,
    quantity: product_quantity.value,
    price: product_selected.value?.price,
    final_price: product_final_price.value,
    store_id: store_id
  }
  cart.value.push(cart_item);
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  product_clicked.value = false
  show_cart.value = !show_cart.value
  msg.value = "Produto adicionado ao carrinho!"
  alert.value = "info"
}

function sendProductCart() {
  if (cart.value.length == 0) {
    mandarProduto()
  } else {
    let loja_carrinho = cart.value[0].store_id
    if(loja_carrinho && loja_carrinho != store_id) {
      msg.value = "A loja é diferente do outro produto"
      alert.value = "error"
      product_clicked.value = !product_clicked.value
    } else {
      mandarProduto()
    }   
  }  
}

</script>

<template>
  
  <NavBar @cartClicked="toggleCart"/> 
  <div class="container">
    <Message v-show="msg" :message="msg" :alert="alert"/>
    <div class="store-row">
      <div class="store-name">
        <img v-if="store.image_url" :src="localhost + store.image_url">
        <h3>{{ store.name }}</h3>        
      </div>          
    </div>
    <hr>

    <div class="products">
      <div v-for="product in products_data" :key = "product.id">
        <div class="card-product" @click="productClicked(product.id)">
          <img v-if="product.image_url" class="card-img" :src="localhost + product.image_url ">
          <img v-else class="card-img" src="../assets/dummy-image-square-1.png">
          <div class="card-title">{{ product.title }}</div>
        </div>        
      </div>      
    </div> 
  </div>

  <div v-if="show_cart" class="modal">  
    <div class="modal-content">      
      <Cart @cartClosed="toggleCart" @productUpdate="showProductUpdate"/>
    </div>
  </div>

  <div v-if="product_clicked" class="modal">
    <div class="modal-content">
      <div class="product-selected">
        <div class="product-img">
          <img v-if="product_selected?.image_url" :src="localhost + product_selected.image_url ">
          <img v-else src="../assets/dummy-image-square-1.png">    
        </div>          
        <div class="product-info">
          <h4 style="text-align: center">{{product_selected?.title}}</h4>
          <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit.</p>
          <p>R$ {{ product_selected?.price }}</p>
          <div class="quantity-price">            
            <input style="width: 80px" type="number" v-model="product_quantity"/>
            <button class="btn-product" @click="sendProductCart">Adicionar R${{ product_final_price }}</button>
          </div>          
        </div>
     </div>    
    </div>
  </div>
  

</template>

<style scoped>

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .store-row {
    display: flex;
  }

  .store-name {
    display: flex;
    gap: 20px;
    align-items: center;
    color: #228b22;
    margin: 10px;
  }

  .products {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    justify-items: center;
  }

  .card-product {
    margin: 10px 12px;
    width: 300px;
    height: 120px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 10px;    
  }

  .card-product:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: transform 0.3s ease
  }

  .card-img {
    width: 50px;
    height: 80px;
    flex: 40%;
    border-radius: 10px;
  }
  
  .card-title {
    font-size: 15px;
    flex: 60%;
    text-align: center;
  }

  .product-selected {
    display: flex;
    padding: 10px;
  }

  .product-img {
    flex: 40%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .product-info {
    flex: 60%;
    display: flex;

    flex-direction: column;
  }

  .quantity-price {
    display: flex;
    gap: 20px;
    justify-content: center;
  }

  .btn-product {
    padding: 0px 10px;
		margin: 0px 10px;  
		color: #228b22;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
		border: 1px solid #228b22;
  }

  .btn-product:hover {
    color: white;
    background-color: #228b22;
  }

  .modal-content {
    min-width: 500px;
  }
  
</style>