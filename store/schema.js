import {schema} from 'normalizr'

export const product = new schema.Entity('products')

export const restaurant = new schema.Entity('restaurants', {
  menu: [product]
})
