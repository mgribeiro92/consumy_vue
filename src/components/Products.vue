<script setup lang="ts">

import { Auth } from '@/auth'
import { ref, onMounted, computed, onUpdated } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { products } from '@/products';
import { stores } from '@/stores'
import Cart from './Cart.vue'
import NavBar from './NavBar.vue';
import Message from './Message.vue';
import ProductSelected from './ProductSelected.vue'

interface Product {
  title: string,
  price: number,
  image_url: string,
  id: number,
  description: Text,
  inventory: number,
}

interface CartItem {
  product: number | undefined;
  title: string | undefined;
  quantity: number;
  price: number | undefined;
  final_price: number;
  store_id: any;
  store_name: string;
}

const auth = new Auth()
const product_price = ref()
const products_data = ref<Product[]>([])
const store = ref({ id: 0, name: '', created_at: '', updated_at: '', image_url: '', products: [], update_at: '', url: '' });
const route = useRoute()
const store_id = route.params.storeId
const localhost = import.meta.env.VITE_BASE_URL
const show_cart = ref(false)
const cart = ref<CartItem[]>([]);
const total_pages = ref()
const current_page = ref(1)
const search_products = ref()
const cart_quantity = ref()

const msg = ref('')
const alert = ref('')
const product_id = ref()

onMounted(async () => {

  try {
    auth.validToken
  } finally {
    const response = await products.getProducts(store_id, current_page.value)
    products_data.value = response.result.products
    if (response.result.pagination) {
      total_pages.value = response.result.pagination.pages
    }
    store.value = await stores.getStore(store_id)
    const cartItem = localStorage.getItem('cartItem')
    cart.value = cartItem ? JSON.parse(cartItem) : []
    cart_quantity.value = cart.value.length
  }
})

onUpdated(() => {
  const cartItem = localStorage.getItem('cartItem')
  cart.value = cartItem ? JSON.parse(cartItem) : []
})

async function nextPage() {
  if (current_page.value < total_pages.value) {
    current_page.value++
    const response = await products.getProducts(store_id, current_page.value)
    products_data.value = response.result.products
  }
}

async function prevPage() {
  if (current_page.value > 1) {
    current_page.value--
    const response = await products.getProducts(store_id, current_page.value)
    products_data.value = response.result.products
  }
}

async function submitSearch() {
  const response = await products.getProductsSearch(store_id, current_page.value, search_products.value)
  products_data.value = response.result.products
  total_pages.value = response.result.pagination.pages
  console.log(search_products.value)
}

function toggleCart(cart_length: any) {
  show_cart.value = !show_cart.value;
  console.log('fechando o cart')
  cart_quantity.value = cart_length
  console.log(cart_quantity.value)
}


function showCart() {
  show_cart.value = !show_cart.value
  product_id.value = null
}

</script>

<template>
  
  <NavBar @cartClicked="toggleCart" :cart_quantity="cart_quantity"/> 
  <div class="container">
    <Message v-show="msg" :message="msg" :alert="alert"/>
    <div class="store-row">
      <div class="store-name">
        <img v-if="store.image_url" :src="localhost + store.image_url">
        <h3>{{ store.name }} - Produtos</h3>
      </div>
        <form class="d-flex" @submit.prevent="submitSearch">
          <input class="form-control" type="search" placeholder="Pesquisar Produtos" v-model="search_products">
          <button class="btn btn-outline-success" type="submit">Pesquisar</button>
      </form>                   
    </div>
    <hr>     
    
    <div class="pagination" v-show="total_pages > 1">
      <button @click="prevPage" :disabled="current_page == 1">Anterior</button>
      <span>{{ current_page }}</span>
      <button @click="nextPage" :disabled="current_page == total_pages">Próxima</button>
    </div>
    <div class="products">      
      <div v-for="product in products_data" :key = "product.id">
        <div class="card-product" @click="product_id = product.id">
          <div class="product-img">
            <img v-if="product.image_url" class="card-img" :src="localhost + product.image_url ">
            <img v-else class="card-img" src="../assets/dummy-image-square-1.png">
          </div>
          <div class="product-info">
            <div class="card-title">{{ product.title }}</div>
            <div class="card-description"> {{ product.description }}</div>
            <div class="card-description" v-if="product.inventory">Valor: R$ {{ product.price }}</div>
            <div class="card-description" v-else>Produto Indisponível</div>
          </div>
        </div>        
      </div>      
    </div>    
  </div>

       
  <Cart v-if="show_cart" @cartClosed="toggleCart"/>

  <ProductSelected v-if="product_id" :product_id="product_id" @showCart="showCart"/>
  

</template>

<style scoped>

  img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
  }

  .store-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
  }

  .store-name {
    display: flex;
    gap: 20px;
    align-items: center;
    color: #228b22;
   }

  .d-flex {
    height: 40px;
   }

  .products {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    justify-items: center;
  }

  .card-description {
    text-align: center;
  }

  .card-product {
    margin: 10px 12px;
    width: 500px;
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

  .product-img {
    width: 50px;
    height: 80px;
    flex: 30%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .product-info {
    flex: 70%;
    padding: 10px;
  }
  
  .card-title {
    font-size: 20px;
    text-align: center;
    font-size: bold;
  }

  .pagination {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
</style>