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
    axios.get('api/stores')
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
  <div class="stores"> 
    <h2>Stores</h2>
    <div 
        v-for = "store in stores"
        :key = "store.id"
    >
      <RouterLink :to="{ name: 'products', params: { storeId: store.id }}">{{ store.name }}</RouterLink>      
    </div>
  </div>
</template>

<style scoped>

  .stores {
    margin: 10px;
  }

  a {
    color: green;
    text-decoration: none;
  }

  a:hover {
    color: grey;
  }  

</style>