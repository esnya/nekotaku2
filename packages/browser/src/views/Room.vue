<template lang="pug">
  #nekotaku-room
    v-app-bar(app collapse-on-scroll dark color="primary")
      v-app-bar-nav-icon
      v-toolbar-title.headline {{room.data.title}}
      v-spacer
    router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class Room extends Vue {
  private readonly room = {
    id: 'room01',
    data: {
      title: '卓01',
    },
  };
}
</script>
