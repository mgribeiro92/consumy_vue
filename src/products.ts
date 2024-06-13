import { Auth } from "./auth"


async function getProducts(store_id: any, page: any) {  
  const auth = new Auth()
  const current_user = auth.currentUser()
  const url = import.meta.env.VITE_BASE_URL + '/stores/' + store_id + '/products?page=' + page
  // const url = 'http://localhost:3000/stores/3/products?page=3'
  const response = await fetch(
    url, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo=",
        "Authorization": "Bearer" + ' ' + current_user?.token
      },
    }
  )
  return await response.json()
}

async function getProductsSearch(store_id: any, page: any, query:any) {  
  const auth = new Auth()
  const current_user = auth.currentUser()
  const url = import.meta.env.VITE_BASE_URL + '/stores/' + store_id + '/products?page=' + page + '&query=' + query
  // const url = 'http://localhost:3000/stores/3/products?page=3'
  const response = await fetch(
    url, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo=",
        "Authorization": "Bearer" + ' ' + current_user?.token
      },
    }
  )
  return await response.json()
}

async function getProduct(product_id: any) {  
  const auth = new Auth()
  const current_user = auth.currentUser()
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/products/' + product_id, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + current_user?.token
      },
    }
  )
  return await response.json()
}

export const products = {
  getProducts,
  getProductsSearch,
  getProduct
}