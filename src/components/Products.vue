<script>

import axios from 'axios';


export default {	
  data() {
    return {      
      data: [],
			storeId: ""
    }
  },
  created() {
		this.storeId = this.$route.params.storeId;		
    axios.get('http://127.0.0.1:3000/api/stores/' + this.storeId)
      .then(response => {
        this.data = response.data;        
      })
      .catch(error => {
        console.error('Erro ao buscar dados da API:', error);
      });
  },
	// mounted() {
  //   console.log(this.$route.params.storeId);    
  // }
}
</script>

<template>
	<div class="products">	
		<h2>Store: {{ data.store.name }}</h2>
		<h3>Products</h3>
		<div class="product"        
				v-for = "product in data.products"
				:key = "product.id"
		>   
				{{ product.title }}
		</div>

		<RouterLink to="/stores">Voltar</RouterLink>

	</div> 
</template>

<style scoped>

	.products {
		margin: 10px
	}

	.product {
		color: green
	}

	a {
		margin-top: 20px
	}

</style>