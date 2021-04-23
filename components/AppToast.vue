<template>
  <div class="toast">
    <button @click="$emit('close')" class="close-toast"></button>
    <slot></slot>
  </div>
</template>

<script>
export default {}
</script>

<style lang="scss" scoped>
.close-toast {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 10px;
  height: 10px;
  padding: 10px;
  background: none;
}
.close-toast::after {
  content: 'x';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  line-height: 1;
}
</style>
