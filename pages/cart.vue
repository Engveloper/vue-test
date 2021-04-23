<template>
  <main class="container cart">
    <v-alert v-if="orderCompleted" type="success" class="alert" color="success">
      Your order has been completed successfully
    </v-alert>
    <h2>Your Cart</h2>
    <section v-if="isCartEmpty" class="emptycart">
      <AppCartEmpty />
    </section>
    <div v-else>
      <table>
        <thead>
          <tr>
            <td>ITEM</td>
            <td>ADD ONS</td>
            <td>AMOUNT</td>
            <td>TOTAL PRICE</td>
          </tr>
        </thead>
        <tbody>
          <tr v-for="itemCart in cart" :key="itemCart.item.id">
            <td>{{ itemCart.item.item }}</td>
            <td>{{ itemCart.foodAddons.join(', ') }}</td>
            <td>{{ itemCart.quantity }}</td>
            <td>{{ itemCart.total }}</td>
          </tr>
          <tr>
            <td colspan="3"></td>
            <td class="total">
              {{ `Total to pay: $${cartTotalPrice.toFixed(2)}` }}
            </td>
          </tr>
        </tbody>
      </table>
      <AppModal :show-modal="pageState === 'loading'">
        <template v-slot:body>
          <div class="center-block">
            <v-progress-circular
              class="loading-spinner"
              :size="60"
              color="amber"
              indeterminate
            >
            </v-progress-circular>
            <h3>Processing your order...</h3>
          </div>
        </template>
      </AppModal>
      <div class="card-form">
        <h3>Please enter your payment details:</h3>
        <h4>Your email</h4>
        <input
          type="email"
          placeholder="name@example.com"
          v-model="$v.cardEmail.$model"
        />

        <h4>Credit Card</h4>
        <div id="card-element"></div>
      </div>
      <button :disabled="!isPaymentInfoValid" @click="checkout">
        Checkout
      </button>
    </div>
  </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import { required, email } from 'vuelidate/lib/validators'

import AppCartEmpty from '@/components/AppCartEmpty.vue'
import AppModal from '@/components/AppModal.vue'

import { VProgressCircular, VAlert } from 'vuetify/lib'

export default {
  mounted() {
    const stripe = this.$stripe
    if (stripe && !this.isCartEmpty) {
      const elements = stripe.elements()
      const cardStyles = {
        style: {
          base: {
            fontSize: '18px'
          }
        }
      }
      this.cardElement = elements.create('card', cardStyles)
      const cardElement = this.cardElement
      cardElement.mount('#card-element')
      cardElement.on('change', event => {
        this.isCardInfoValid = !(this.isCardInfoValid && event.error)
      })

      this.$store.dispatch('createPaymentIntent')
    }
  },
  components: {
    AppCartEmpty,
    AppModal,

    VProgressCircular,
    VAlert
  },
  computed: {
    ...mapState(['cart']),
    ...mapGetters(['cartTotalPrice', 'cartItemsCount']),
    isCartEmpty() {
      return this.cartItemsCount == 0
    },
    isPaymentInfoValid() {
      return !this.$v.cardEmail.$invalid && this.isCardInfoValid
    }
  },
  data() {
    return {
      isCardInfoValid: false,
      cardEmail: '',
      cardElement: null,
      orderCompleted: false,
      pageState: 'idle'
    }
  },
  methods: {
    checkout() {
      const stripe = this.$stripe
      if (stripe) {
        this.pageState = 'loading'
        stripe
          .confirmCardPayment(this.$store.state.stripeClientSecret, {
            payment_method: {
              card: this.cardElement,
              billing_details: {
                email: this.cardEmail
              }
            }
          })
          .then(result => {
            this.pageState = 'idle'
            this.orderCompleted = true
            console.log(result)
          })
      }
    }
  },
  validations() {
    return {
      cardEmail: {
        required,
        email
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#card-element {
  border: solid 1px #c7c7c7;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
}
input {
  border: solid 1px #c7c7c7;
  border-radius: 5px;
  font-size: 18px;
  padding: 10px;
  margin-bottom: 10px;
  width: 100%;
}
button:disabled {
  background: #bec3c3;
}
.alert {
  position: absolute;
  right: 30px;
  top: 30px;
}
.card-form h3 {
  margin-bottom: 10px;
}
.center-block {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.loading-spinner {
  margin-bottom: 30px;
}
</style>
