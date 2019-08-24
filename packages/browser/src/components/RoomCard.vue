<template lang="pug">
  v-card
    v-img(:src="`/img/resources/${room.data.imageId}`" v-if="room.data.imageId")
      card-title-on-image {{room.data.title}}
    v-card-title(v-else) {{room.data.title}}
    template(v-if="room.data.description")
      v-card-actions
        div(v-show="!showDescription && collapseDescription") {{room.data.description}}
        v-spacer
        v-btn(icon @click="showDescription = !showDescription" v-if="collapseDescription")
          v-icon {{showDescription ? 'mdi-up' : 'mdi-down'}}
      v-expand-transition
        div(v-show="showDescription || !collapseDescription")
          v-card-text
            p(:key="i" v-for="line, i in descriptionLines") {{line}}
    v-list(dense)
      v-list-item
        v-list-item-content ゲーム:
        v-list-item-content.align-end {{room.data.gameName}}
      v-list-item
        v-list-item-content 作成者:
        v-list-item-content.align-end
          promise-value(:promise="userName")
      v-list-item
        v-list-item-content 作成日時:
        v-list-item-content.align-end
          moment(:value="room.data.createdAtText")
    v-card-actions
      v-spacer
      v-btn(color="primary" :href="`/rooms/${room.id}`") 参加
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Document from 'nekotaku-core/types/Document';
import Room from 'nekotaku-core/types/Room';
import CardTitleOnImage from './CardTitleOnImage.vue';
import Moment from './Moment.vue';
import PromiseValue from './PromiseValue.vue';

@Component({
  components: {
    CardTitleOnImage,
    Moment,
    PromiseValue,
  },
})
export default class RoomCard extends Vue {
  @Prop({ required: false, type: Boolean, default: false })
  collapseDescription!: boolean;

  @Prop({ required: true, type: Object }) room!: Document<Room>;
  private showDescription: boolean = true;

  private get descriptionLines(): string[] {
    const { description } = this.room.data;
    return description ? description.split(/\n/g) : [];
  }

  private get userName(): Promise<string> {
    return new Promise<string>(resolve =>
      setTimeout(() => resolve('ユーザー'), 1000),
    ); // ToDo
  }
}
</script>
