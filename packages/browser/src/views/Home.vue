<template lang="pug">
  #nekotaku-home
    v-app-bar.pr-0(app dark collapse-on-scroll color="primary")
      img.mr-4(:src="logo" height=42)
      v-toolbar-title.headline ねこ卓
      v-spacer
    v-content
      v-container
        welcome-card.mb-3(create-target="#nekotaku-room-creation" search-target="#nekotaku-room-search")
        room-creation-card.mb-3#nekotaku-room-creation
        room-search-card(v-model="search").mb-3#nekotaku-room-search
        room-list-card(:search="search").mb-3
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Logo from '../assets/logo.svg';
import RoomCreationCard from '../components/RoomCreationCard.vue';
import RoomListCard from '../components/RoomListCard.vue';
import RoomSearchCard from '../components/RoomSearchCard.vue';
import WelcomeCard from '../components/WelcomeCard.vue';
import Search from '../types/Search';

@Component({
  components: {
    RoomCreationCard,
    RoomListCard,
    RoomSearchCard,
    WelcomeCard,
  },
})
export default class Home extends Vue {
  private readonly logo = Logo;
  private search: Search = {
    search: null,
    sortBy: 'createdAt',
    sortDesc: true,
  };
}
</script>
