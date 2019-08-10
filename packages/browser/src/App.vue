<template lang="pug">
  #app
    #nav
      router-link(to="/") Home
      span |
      router-link(to="/about") About
    router-view
</template>
