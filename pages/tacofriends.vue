<template>
  <main>
    <h1>Our Taco Friends</h1>
    <ul>
      <li
        v-for="comment in comments"
        :key="comment"
        @click="commentAlert(comment)"
      >
        {{ comment }}
      </li>
    </ul>
    <p><i>Click on a friend!</i></p>
  </main>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'

export default defineComponent({
  setup() {
    const comments = ref([
      'Sarah likes all tacos',
      'Brian Holt likes whiskey more than tacos'
    ])

    return {
      comments
    }
  },
  methods: {
    commentAlert(comment) {
      alert(comment)
    }
  }
})
</script>

<style lang="scss" scoped>
main {
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
  padding: 40px;
}
ul {
  margin: 25px;
  width: 400px;
  text-align: left;
}
ul > li {
  padding: 10px;
  cursor: pointer;
  transition: background 0.4s ease;
}
ul > li:hover {
  background: #f3f3f3;
}
</style>
