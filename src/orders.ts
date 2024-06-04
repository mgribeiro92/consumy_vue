import { Auth } from './auth'

const auth = new Auth()
const current_user = auth.currentUser()

class Orders {
  async createOrder(store: any, order_items: any) {
    const body_order = {
      order: {
        store_id: store,
        order_items_attributes: order_items
      }
    }
    console.log(body_order)
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
    console.log(order_data)
    // const order_id = order_data.id
    // this.createOrderItem(cart, order_id)
    return order_data
  }
  
  async createOrderItem(cart: any, order_id: number) {
    console.log(cart)
    for (const order_item of cart) {
      const body_order_item = {
        order_item: {
          order_id: order_id,
          product_id: order_item.product,
          amount: order_item.quantity,
        }
      }
      const response = await fetch(
        import.meta.env.VITE_BASE_URL + '/order_items', {
          method: 'POST',
          headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + current_user?.token,
            "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
          },
          body: JSON.stringify(body_order_item)
        }
      )
      const result = await response.json()
      console.log('Resposta da requisição:', result)
      
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    const orderComplete = true
    return orderComplete
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

  async getOrder(order_id: any) {
    const response = await fetch(
      import.meta.env.VITE_BASE_URL + '/buyers/orders/' + order_id, {
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

export { Orders }