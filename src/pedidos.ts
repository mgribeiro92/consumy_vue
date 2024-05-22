import { Auth } from './auth'

const auth = new Auth()
const current_user = auth.currentUser()

class Order {
  async createOrder(cart: any) {
    console.log('criando o pedido')
    console.log(cart)
    const body_order = {
      order: {
        store_id: cart[0].store_id
      }
    }
    const response = await fetch(
      import.meta.env.VITE_BASE_URL + '/buyers/orders', {
        method: 'POST',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer" + ' ' + current_user?.token,
          "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
        },
        body: JSON.stringify(body_order)
      }
    )
    const order_data = await response.json()
    const order_id = order_data.id 
    this.createOrderItem(cart, order_id)
    return response
  }
  
  createOrderItem(cart: any, order_id: number) {
    console.log(cart)
    cart.forEach(async (order_item: { product: any; quantity: any }) => {
      const body_order_item = {
        order_item: {
          order_id: order_id,
          product_id: order_item.product,
          amount: order_item.quantity
        }
      }
      console.log(body_order_item)
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + '/order_items', {
          method: 'POST',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer" + ' ' + current_user?.token,
            "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
          },
          body: JSON.stringify(body_order_item)
        }
      )
      return await response.json()
    })
  }
  
  async getOrders() {
    console.log('pegando os pedidos')
    const response = await fetch(
      import.meta.env.VITE_BASE_URL + '/buyers/orders', {
        method: 'GET',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer" + ' ' + current_user?.token,
          "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
        },
      }
    )
    return await response.json() 
  }
}

export { Order }