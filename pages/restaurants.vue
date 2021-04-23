<template>
  <main class="container restaurant">
    <div class="restaurantheading">
      <h1>Restaurants</h1>
      <AppSelect @change="selectedRestaurant = $event" />
    </div>
    <AppRestaurantInfo :datasource="filteredFoodData" />
  </main>
</template>

<script>
import AppRestaurantInfo from '@/components/AppRestaurantInfo.vue'
import AppSelect from '@/components/AppSelect.vue'
import {mapState} from 'vuex'

export default {
  components: {
    AppRestaurantInfo,
    AppSelect
  },
  computed: {
    ...mapState(['fooddata']),
    filteredFoodData() {
      return this.fooddata.filter(restaurant => {
        const name = restaurant.name.toLowerCase()
        return name.includes(this.selectedRestaurant)
      })
    }
  },
  methods: {
    test() {
      console.log(this.fooddata)
    }
  },
  data() {
    return {
      selectedRestaurant: ''
    }
  }
}
</script>

<style lang="scss" scoped></style>
