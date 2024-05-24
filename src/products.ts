import { Auth } from "./auth"

const auth = new Auth()
const current_user = auth.currentUser()

async function getProducts(store_id: any, page: any) {
  const url = import.meta.env.VITE_BASE_URL + '/stores/' + store_id + '/products?page=' + page
  // const url = 'http://localhost:3000/stores/3/products?page=3'
  console.log(url)
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
  getProduct
}