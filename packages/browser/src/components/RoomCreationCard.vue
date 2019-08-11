<template lang="pug">
  v-card
    v-card-title.headline 卓を立てる
    v-card-text
      v-form(v-model="valid")#nekotaku-create-room-form
        v-text-field(
          required
          name="title"
          label="タイトル"
          :counter="100"
          :rules="titleRules"
          v-model="title"
        )
        v-autocomplete(
          required
          label="ゲーム"
          :items="gameTypeItems"
          :rules="gameTypeRules"
          v-model="gameType"
        )
        v-radio-group(row v-model="isLocked")
          v-radio(label="誰でも参加可能" :value="false")
          v-radio(label="パスワード入力で参加" :value="true")
        v-text-field(
          required
          name="password"
          label="パスワード"
          :counter="100"
          :rules="passwordRules"
          v-model="password"
          v-if="isLocked"
        )
    v-card-actions
      v-spacer
      v-btn(disabled color="primary" :size="16" v-if="creating")
        v-progress-circular(indeterminate)
      v-btn(color="primary" :disabled="!valid" @click="create" v-else) 卓を立てる
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import BCDice from 'bcdice';
import sortBy from 'lodash-es/sortBy';
import { required, maxLength } from '../validators';

@Component({
  components: {},
})
export default class RoomCreationCard extends Vue {
  private valid: boolean = false;

  private title: string | null = null;
  private readonly titleRules = [required, maxLength(100)];

  private gameType: string | null = null;
  private readonly gameTypeItems = sortBy(
    BCDice.infoList.map(info => ({
      text: info.gameName,
      value: info.gameType,
    })),
    a => a.text,
  );
  private readonly gameTypeRules = [required];

  private isLocked: boolean = false;
  private password: string | null = null;
  private readonly passwordRules = [required, maxLength(100)];

  private creating: boolean = false;

  private create(): void {
    // ToDo
    this.creating = true;
    setTimeout(() => {
      this.creating = false;
      this.$router.push({ path: `/rooms/room01` });
    }, 500);
  }
}
</script>
