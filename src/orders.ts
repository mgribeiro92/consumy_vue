import { Auth } from './auth'


async function createOrder(store: any, order_items: any) {  
  const auth = new Auth()
  const current_user = auth.currentUser()
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
        "X-API-KEY": "5VdKWFE09B5O8gnjZ5+OuEKanoI="
      },
      body: JSON.stringify(body_order)
    }
  )
  return await response.json()
}
  
async function getOrders() {  
  const auth = new Auth()
  const current_user = auth.currentUser()
  console.log('pegando os pedidos')
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/buyers/orders', {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + current_user?.token,
        "X-API-KEY": "5VdKWFE09B5O8gnjZ5+OuEKanoI="
      },
    }
  )
  return await response.json() 
}

async function getOrder(order_id: any) {  
  const auth = new Auth()
  const current_user = auth.currentUser()
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/buyers/orders/' + order_id, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + current_user?.token,
        "X-API-KEY": "5VdKWFE09B5O8gnjZ5+OuEKanoI="
      },
    }
  )
  return await response.json() 
}

async function sendPayment(credit_card: any, order: any) {  
  const auth = new Auth()
  const current_user = auth.currentUser()
  const body = {     
    payment: {
      order_id: order.id,
      value: order.total,
      number: credit_card.number,
      valid: credit_card.valid,
      cvv: credit_card.cvv
    } 
  }
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/payments', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + current_user?.token,
        "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
      },
      body: JSON.stringify(body)
    }
  )
  const data = await response.json()
  console.log(data)
}


export const orders = {
  getOrders,
  getOrder,
  createOrder,
  sendPayment
}