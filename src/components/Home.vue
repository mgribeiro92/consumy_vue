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
  distance: string;
  category: string;
}

const stores_data = ref<Store[]>([])
const localhost = "http://127.0.0.1:3000/"
const show_cart = ref(false)
const search_stores = ref()

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

async function filterStore(filter: any) {
  console.log(filter)
  const store_response = await stores.getStoresSearch(filter)
  console.log(store_response)
  stores_data.value = store_response.stores
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
    <h5>Filtros:</h5>
    <div class="categories">
      <div @click="filterStore('near=yes')" class="card-category">Mais pertos</div>
      <div @click="filterStore('filter=Restaurante')" class="card-category">Restaurantes</div>
      <div @click="filterStore('filter=Doceria')" class="card-category">Doceria</div>
      <div @click="filterStore('filter=Bebidas')" class="card-category">Bebidas</div>
    </div>
    <div style="margin-top: 20px" v-if="stores_data.length == 0">Não encontramos nenhuma loja com essa pesquisa!</div>
    <div v-else class="stores">
      <div v-for="store in stores_data" :key = "store.id">
        <RouterLink :to="{ name: 'products', params: { storeId: store.id }}">
          <div class="card-store">
            <div class="store-img">
              <img v-if="store.image_url" :src="localhost + store.image_url ">
              <img v-else src="../assets/dummy-image-square-1.png">
            </div>
            <div class="store-info">
              <div class="store-title">{{ store.name }}</div>
              <div class="store-category">{{ store.category }}</div>
              <div class="distance">Distancia: {{ store.distance }} km</div>
            </div>

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

  img {
    width: 80px;
    height: 80px;
    border-radius: 10px;
  }

  .categories {
    display: flex;
    gap: 50px;
    margin-left: 10px;
  }

  .card-category {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 10px;
  }

  .card-category:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: transform 0.3s ease
  }


  .card-store {
    margin: 10px 12px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    display: flex;
    align-items: center;
    border-radius: 10px;
    padding: 10px;
  }

  .store-title {
    display: flex;
    justify-content: space-between;
    margin-top: 10px;
  }

  .store-info {
    flex: 7;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }

  .store-img {
    flex: 3;
  }

  .stores {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px; 
  }

  .card-store:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: transform 0.3s ease
  }

  .store-title {
    font-size: 15px;
    flex: 60%;
    text-align: center;
    font-weight: bold;
  }

  .store-category {
    font-size: 15px;
  }



</style>