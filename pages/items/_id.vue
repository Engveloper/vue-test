<template>
  <main class="container">
    <img class="image" :src="`/${restaurant.img}`" :alt="restaurant.item" />
    <section class="details">
      <h1>{{ restaurant.item }}</h1>
      <h3>Price: ${{ restaurant.price }}</h3>
      <div class="quantity">
        <p>Qty.</p>
        <input
          id="quantity"
          min="1"
          name="quantity"
          type="number"
          value="1"
          v-model="quantity"
        />
        <button @click="submitOrder">Add to Cart - ${{ total }}</button>
      </div>
      <fieldset v-if="restaurant.options">
        <legend>Options</legend>
        <div v-for="option in restaurant.options" :key="option">
          <input
            type="radio"
            :id="option"
            name="option"
            :value="option"
            v-model="$v.foodOption.$model"
          />
          <label :for="option">{{ option }}</label>
        </div>
      </fieldset>
      <fieldset v-if="restaurant.addOns">
        <legend>Addons</legend>
        <div v-for="addon in restaurant.addOns" :key="addon">
          <input
            type="checkbox"
            :id="addon"
            :value="addon"
            v-model="$v.foodAddons.$model"
          />
          <label :for="addon">{{ addon }}</label>
        </div>
      </fieldset>
      <AppToast v-if="orderSubmitted" @close="closeToast">
        Order Submitted <br />
        Check out more <nuxt-link to="/restaurants">restaurants</nuxt-link>
      </AppToast>
      <AppToast v-if="errors" @close="closeToast">
        Please select options and addons before continuing
      </AppToast>
    </section>
    <section class="description">
      <h3>Description</h3>
      <p>{{ restaurant.description }}</p>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import AppToast from '@/components/AppToast.vue'
import { required } from 'vuelidate/lib/validators'

export default {
  async asyncData({ params }) {
    const id = params.id
    return { id }
  },
  components: {
    AppToast
  },
  computed: {
    ...mapState({
      restaurant(state) {
        return state.entities.products[this.id]
      }
    }),
    total() {
      const total = this.restaurant.price * this.quantity
      return total.toFixed(2)
    }
  },
  data() {
    return {
      foodAddons: [],
      foodOption: '',
      orderSubmitted: false,
      errors: false,
      quantity: 1
    }
  },
  methods: {
    submitOrder() {
      const cartItemData = {
        item: this.restaurant,
        quantity: this.quantity,
        total: this.total,
        foodAddons: this.foodAddons,
        foodOption: this.foodOption
      }

      const addonsError = this.$v.foodAddons.$invalid
      const optionError = this.restaurant.options
        ? this.$v.foodOption.$invalid
        : false

      if (addonsError || optionError) {
        this.errors = true
      } else {
        this.errors = false
        this.orderSubmitted = true
        this.$store.dispatch('addToCart', cartItemData)
      }
    },
    closeToast() {
      this.orderSubmitted = false
      this.errors = false
    }
  },
  validations() {
    return {
      foodAddons: {
        required
      },
      foodOption: {
        required
      }
    }
  }
}
</script>

<style lang="scss" scoped>
fieldset > legend {
  font-weight: bold;
}
fieldset {
  padding: 20px;
}
fieldset > div {
  margin: 10px 0;
}
.container {
  display: grid;
  margin: 100px auto;
  max-width: 1000px;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  grid-template-rows: repeat(2, 1fr);
  grid-template-areas:
    'image details'
    'description details';
  gap: 60px;
}
.image {
  grid-area: image;
  width: 100%;
  max-height: 400px;
}
.details {
  grid-area: details;
}
.description {
  grid-area: description;
}
.div4 {
  grid-area: 3 / 2 / 4 / 4;
}
.quantity {
  display: flex;
  align-items: center;
}
.quantity p {
  margin-bottom: 0;
  margin-right: 10px;
}
.quantity input {
  width: 70px;
  border: solid 1px #dddddd;
  padding: 5px;
}
</style>
