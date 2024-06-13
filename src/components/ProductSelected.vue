<script setup lang="ts">

import { ref, onMounted, computed, defineEmits } from 'vue'
import { products } from '@/products'
import Message from './Message.vue';
import { useRouter } from 'vue-router';

const router = useRouter()

interface Product {
  title: string,
  price: number,
  image_url: string,
  id: number,
  description: Text;
  inventory: number;
}

interface CartItem {
  product_id: number | undefined;
  title: string | undefined;
  amount: number;
  price: number | undefined;
  final_price: number;
  store_id: any;
  store_name: string;
}

const product_quantity = ref<number>(1)
const product_clicked = ref(false)
const product_selected = ref<Product | null>(null)
const localhost = import.meta.env.VITE_BASE_URL
const cart = ref<CartItem[]>([]);
const msg = ref('')
const alert = ref('')
const store_id = ref()
const store_name = ref()

// const { product_id } = defineProps(['product_id'])
const { product_id, product_index } = defineProps(['product_id', 'product_index'])

onMounted(async() => {
  const product = await products.getProduct(product_id)
  product_selected.value = product.product
  store_id.value = product.product.store_id
  store_name.value = product.product.store_name
  const cartItem = localStorage.getItem('cartItem')
  cart.value = cartItem ? JSON.parse(cartItem) : []
})

const product_final_price = computed(() => product_quantity.value * product_selected.value!.price)

// function showProductUpdate(product_id: number) {
//   show_cart.value = !show_cart.value;
//   product_clicked.value = !product_clicked.value;
//   productClicked(product_id)
// }

// function productClicked(product_id: number) {
//   product_clicked.value = true
//   product_selected.value = products_data.value.find(product => product.id === product_id)
//   product_price.value = product_selected.value?.price
// }


const emit = defineEmits(['showCart'])

function mandarProduto() {
  console.log('produto enviado para o carrinho')
  const cart_item = {
    product_id: product_selected.value?.id,
    title: product_selected.value?.title,
    amount: product_quantity.value,
    price: product_selected.value?.price,
    final_price: product_final_price.value,
    store_id: store_id.value,
    store_name: store_name.value
  }
  console.log(cart_item)
  cart.value.push(cart_item);
  localStorage.setItem('cartItem', JSON.stringify(cart.value))
  // product_clicked.value = false
  // show_cart.value = !show_cart.value
  // msg.value = "Produto adicionado ao carrinho!"
  // alert.value = "info"
  showCart()
}

function showCart() {
  emit('showCart') 
}

function sendProductCart() {
  if (cart.value.length == 0) {
    mandarProduto()
  } else {
    let loja_carrinho = cart.value[0].store_id
    if(loja_carrinho && loja_carrinho != store_id.value) {
      msg.value = "Os produtos do carrinho são de lojas diferentes!"
      alert.value = "error"      
    } else {
      mandarProduto()
    }   
  }

}

</script>

<template>

  <div class="modal">
    <div class="modal-content">
      <Message v-show="msg" :message="msg" :alert="alert"/>
      <span class="close" @click="showCart">&times;</span>
      <div class="product-selected" v-if="product_selected">
        <div class="product-img">
          <img v-if="product_selected.image_url" :src="localhost + product_selected.image_url ">
          <img v-else src="../assets/dummy-image-square-1.png">    
        </div>          
        <div class="product-info">
          <h4 style="text-align: center">{{product_selected.title}}</h4>
          <p>{{ product_selected.description }}</p>
          <p>R$ {{ product_selected.price }}</p>
          <div v-if="product_selected.inventory" class="quantity-price">            
            <input style="width: 80px" type="number" min="0" v-model="product_quantity" value="1"/>
            <button class="btn-product" :class="{ 'disabled-button': product_quantity <= 0 }" :disabled="product_quantity <= 0" @click="sendProductCart">Adicionar R${{ product_final_price }}</button>
          </div>
          <div v-else>Produto Indisponível</div>          
        </div>
     </div>    
    </div>
  </div>

</template>

<style scoped>

  .disabled-button {
    /* Estilos para o botão desativado */
    opacity: 0.5; /* Exemplo: reduz a opacidade do botão */
    cursor: not-allowed; /* Exemplo: altera o cursor para indicar que o botão está desativado */
  }
  
  img {
    width: 100%;
    height: 100%;
    border-radius: 10px;
  }

  .product-selected {
    display: flex;
    padding: 10px;
    gap: 10px;
    height: 200px;
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
    margin-bottom: auto;
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


  .close {
    position: absolute;
    left: 10px;
    top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: black;
    cursor: pointer;
  }

</style>