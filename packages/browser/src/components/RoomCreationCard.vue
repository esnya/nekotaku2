<template lang="pug">
  v-card
    v-img(:src="imageUrl" v-if="imageUrl")
      card-title-on-image 卓を立てる
    v-card-title.headline(v-else) 卓を立てる
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
        v-textarea(
          label="卓紹介（省略可）"
          :rules="descriptionRules"
          :counter="1000"
          v-model="description"
        )
        v-file-input(
          label="アイキャッチ画像（省略可）"
          accept="image/*"
          v-model="image"
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
import CardTitleOnImage from './CardTitleOnImage.vue';

@Component({
  components: {
    CardTitleOnImage,
  },
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

  private description: string | null = null;
  private readonly descriptionRules = [maxLength(1000)];

  private image: File | null = null;
  private get imageUrl(): string | null {
    return this.image && URL.createObjectURL(this.image);
  }

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
