<script>

import axios from 'axios';
import { RouterView } from 'vue-router';

export default {  
  data() {
    return {
      stores: [],
    }
  },
  created() {
    axios.get('http://127.0.0.1:3000/stores')
      .then(response => {
        this.stores = response.data;
      })
    .catch(error => {
      console.error('Erro ao buscar dados da API:', error);
    });
  },
}


</script>

<template>
  <div class="container">
    <h2>Stores</h2>
    <hr>
    <div class="stores">
      <div class="card" v-for = "store in stores" :key = "store.id">

      <div class="card-body">
        <h5 class="card-title">{{ store.name }}</h5>
        <RouterLink :to="{ name: 'products', params: { storeId: store.id }}">Show products</RouterLink>
      </div>

            
      </div>
    </div>
    
  </div>
</template>

<style scoped>

  .card {
    margin: 10px;
    width: 18rem
  }

  a {
    color: green;
    text-decoration: none;
  }

  .stores {
    display: flex;
  }


  a:hover {
    color: grey;
  }  

</style>