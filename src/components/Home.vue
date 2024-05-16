<script setup lang="ts">
import { Auth } from '@/auth'
import { ref, onMounted, onUpdated } from 'vue'
import NavBar from '@/components/NavBar.vue';
import { stores } from '@/stores'

const stores_data = ref()
const localhost = "http://127.0.0.1:3000/"

onMounted(async () => {
  stores_data.value = await stores.getStores()
  console.log(stores_data.value)
})


</script>

<template>
  <div class="container">

    <div class="categories">
    </div>
    <hr>
    <div class="stores">
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
</template>


<style scoped>

  a {
    text-decoration: none;
    color: inherit;
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