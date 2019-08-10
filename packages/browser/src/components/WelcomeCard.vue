<template lang="pug">
  v-card
    v-card-title.headline ねこ卓
    v-card-text
      div スマホでも、パソコンでもTRPGを。
      div ねこ卓へようこそ！
      div まずは卓を立てますか？それとも誰かの卓を探して入りますか？
    v-card-actions
      v-spacer
      v-btn(color="primary" @click="$vuetify.goTo(createTarget, {})") 卓を立てる
      v-spacer
      v-btn(color="primary" @click="$vuetify.goTo(searchTarget, {})") 卓を探す
      v-spacer
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {
  },
})
export default class WelcomeCard extends Vue {
  @Prop({ type: String, required: true }) createTarget!: string;
  @Prop({ type: String, required: true }) searchTarget!: string;
}
</script>
