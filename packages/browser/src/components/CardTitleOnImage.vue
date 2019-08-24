<template lang="pug">
  v-layout.nekotaku-title-on-image-container(align-end fill-height)
    v-card-title.nekotaku-title-on-image.white--text.headline
      slot
</template>

<style scoped lang="stylus">
.nekotaku-title-on-image-container {
  margin-top: 0 !important
}

.nekotaku-title-on-image {
  background-color: rgba(0, 0, 0, 0.5)
  width: 100%;
}
</style>
