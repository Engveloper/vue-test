<template>
  <nav>
    <ul>
      <li>
        <nuxt-link to="/"><AppLogo /></nuxt-link>
      </li>
      <li><nuxt-link to="/restaurants">Restaurants</nuxt-link></li>
      <li><nuxt-link to="/tacofriends">Our taco friends</nuxt-link></li>
    </ul>
    <div v-if="cartItemsCount" class="smallnum">{{ cartItemsCount }}</div>
    <nuxt-link to="/cart">Cart</nuxt-link>
  </nav>
</template>

<script>
import AppLogo from '@/components/AppLogo.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    AppLogo
  },
  computed: {
    ...mapGetters(['cartItemsCount'])
  }
}
</script>

<style lang="scss" scoped></style>
