<template lang="pug">
  #nekotaku-home
    v-app-bar.pr-0(app dark collapse-on-scroll color="primary")
      img.mr-4(:src="logo" height=42)
      v-toolbar-title.headline ねこ卓
      v-spacer
    v-content
      v-container
        welcome-card(create-target="#nekotaku-room-creation" search-target="#nekotaku-room-search").mb-3
        room-creation-card#nekotaku-room-creation.mb-3
        room-list-card#nekotaku-room-search.mb-3
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Logo from '../assets/logo.svg';
import RoomCreationCard from '../components/RoomCreationCard.vue';
import RoomListCard from '../components/RoomListCard.vue';
import WelcomeCard from '../components/WelcomeCard.vue';

@Component({
  components: {
    RoomCreationCard,
    RoomListCard,
    WelcomeCard,
  },
})
export default class Home extends Vue {
  private readonly logo = Logo;
}
</script>
