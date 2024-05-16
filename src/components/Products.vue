<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { products } from '@/products';
import { stores } from '@/stores'

const products_data = ref()
const store = ref('')
const route = useRoute()
const store_id = route.params.storeId
const localhost = import.meta.env.VITE_BASE_URL

onMounted(async () => {
  products_data.value = await products.getProducts(store_id)
  store.value = await stores.getStore(store_id)
  console.log(products_data.value)
  console.log(store.value)
})

</script>


<template>
  
  <div class="container">
    <div class="store-row">
      <div class="store-name">
        <img v-if="store.image_url" :src="localhost + store.image_url">
        <h3>{{ store.name }}</h3>        
      </div>          
    </div>
    <hr>

    <div class="products">
      <div v-for="product in products_data" :key = "product.id">
        <div class="card-product">
          <img v-if="product.image_url" class="card-img" :src="localhost + product.image_url ">
          <img v-else class="card-img" src="../assets/dummy-image-square-1.png">
          <div class="card-title">{{ product.title }}</div>
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
    width: 250px;
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


</style>