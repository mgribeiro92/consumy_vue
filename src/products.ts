import { Auth } from "./auth"

const auth = new Auth()
const current_user = auth.currentUser()

async function getProducts(store_id: any) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/products/store/' + store_id, {
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
  getProducts
}