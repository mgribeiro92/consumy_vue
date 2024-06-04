<script setup lang="ts">
import { Auth } from '@/auth'
import { ref, onMounted, onUpdated } from 'vue'
import NavBar from '@/components/NavBar.vue';
import { stores } from '@/stores'
import Cart from '../components/Cart.vue'


interface Store {
  image_url: string;
  name: string;
  id: number;
}

const stores_data = ref<Store[]>([])
const localhost = "http://127.0.0.1:3000/"
const show_cart = ref(false)
const search_stores = ref()
console.log(search_stores.value)

onMounted(async () => {
  const store_response = await stores.getStores()
  stores_data.value = store_response.stores
  console.log(stores_data.value)
})

const toggleCart = () => {
  show_cart.value = !show_cart.value;
}

async function submitSearch() {
  const store_response = await stores.getStoresSearch(search_stores.value)
  stores_data.value = store_response.stores
  console.log(stores_data.value.length)
}


</script>

<template>
  <NavBar @cartClicked="toggleCart"/>
  <div class="container">
    <div class="store-title">
      <h3>Stores</h3>
      <form class="d-flex" @submit.prevent="submitSearch">
        <input class="form-control me-2" type="search" placeholder="Pesquisar Lojas" v-model="search_stores">
        <button class="btn btn-outline-success" type="submit">Pesquisar</button>
      </form>
    </div>
    <hr>
    <div class="categories">
    </div>
    <div v-if="stores_data.length == 0">Não encontramos nenhuma loja com essa pesquisa!</div>
    <div v-else class="stores">
      <div v-for="store in stores_data" :key = "store.id">
        <RouterLink :to="{ name: 'products', params: { storeId: store.id }}">
          <div class="card-store">
            <img v-if="store.image_url" class="card-img" :src="localhost + store.image_url ">
            <img v-else class="card-img" src="../assets/dummy-image-square-1.png">
            <div class="card-title">{{ store.name }}</div>
          </div> 
        </RouterLink>
      </div>      
    </div>    
  </div>
  
  <Cart v-if="show_cart"  @cartClosed="toggleCart"/>

</template>


<style scoped>

  a {
    text-decoration: none;
    color: inherit;
  }

  .store-title {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .stores {
    display: flex;
    flex-wrap: wrap;
  }

  .card-store {
    margin: 10px 12px;
    width: 250px;
    height: 120px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 10px;    
  }

  .card-store:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: transform 0.3s ease
  }

  .card-title {
    font-size: 15px;
    flex: 60%;
    text-align: center;
  }

  .card-img {
    width: 50px;
    height: 80px;
    flex: 40%;
    border-radius: 10px;
  }

</style>