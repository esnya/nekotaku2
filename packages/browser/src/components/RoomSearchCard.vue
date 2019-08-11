<template lang="pug">
  v-card
    v-card-title.headline 卓を探す
    v-card-text
      v-text-field(label="キーワード検索" :value="value.search" @input="onInput('search', $event)")
      v-select(label="並び順" :items="items" :value="value.sortBy" @input="onInput('sortBy', $event)")
      v-radio-group(:value="value.sortDesc" @change="onInput('sortDesc', $event)")
        v-radio(label="昇順" :value="false")
        v-radio(label="降順" :value="true")
</template>

<script lang="ts">
import { Component, Vue, Prop, Emit } from 'vue-property-decorator';
import Search from '../types/Search';

@Component({
  components: {},
})
export default class RoomSearchCard extends Vue {
  @Prop({ required: true, type: Object }) private value!: Search;

  private readonly items = [
    { text: '作成日時', value: 'createdAt' },
    { text: 'タイトル', value: 'title' },
    { text: 'ゲーム', value: 'gameType' },
  ];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @Emit('input') private emitInput(value: Search): void {}

  private onInput(key: keyof Search, value: string | boolean): void {
    this.emitInput({
      ...this.value,
      [key]: value,
    });
  }
}
</script>
