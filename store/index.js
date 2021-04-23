import { normalize } from 'normalizr'
import { restaurant } from './schema'
import Vue from 'vue'

export const state = () => ({
  cart: [],
  fooddata: [],
  entities: {
    products: {},
    restaurants: {}
  },
  stripeClientSecret: ''
})

export const getters = {
  cartTotalPrice: state => {
    return state.cart.reduce((accum, { total = 0 }) => {
      return (accum += Number(total))
    }, 0)
  },
  cartItemsCount: state => {
    return state.cart.reduce((accum, { quantity }) => {
      return accum + Number(quantity)
    }, 0)
  }
}

export const mutations = {
  updateClientSecret(state, payload) {
    state.stripeClientSecret = payload
  },
  updateFoodData(state, payload) {
    state.fooddata = payload
  },
  UPDATE_ENTITIES(state, { entities }) {
    for (let type in entities) {
      for (let entity in entities[type]) {
        const oldEntities = state.entities[type][entity] || {}

        Vue.set(state.entities[type], entity, {
          ...oldEntities,
          ...entities[type][entity]
        })
      }
    }
  },
  pushItemToCart(state, payload) {
    state.cart.push(payload)
  }
}

export const actions = {
  async loadFoodData({ state, commit }) {
    if (state.fooddata.length) {
      return
    }

    try {
      await fetch(
        'https://u6km5bb9yc.execute-api.us-east-2.amazonaws.com/prod/restaurants',
        {
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': process.env.AWS_API_KEY
          }
        }
      )
        .then(response => response.json())
        .then(data => {
          commit('updateFoodData', data.fooddata)
          commit('UPDATE_ENTITIES', normalize(data.fooddata, [restaurant]))
        })
    } catch (err) {
      console.log(err)
    }
  },
  addToCart({ commit }, payload) {
    commit('pushItemToCart', payload)
  },
  async createPaymentIntent({ commit, getters }) {
    const body = {
      amount: Number(getters.cartTotalPrice),
      currency: 'usd'
    }

    try {
      const backResponse = await fetch('/api/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const jsonResponse = await backResponse.json()
      commit('updateClientSecret', jsonResponse['client_secret'])
    } catch (error) {
      console.error(error)
    }
  }
}
