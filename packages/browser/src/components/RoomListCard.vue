<template lang="pug">
  v-data-iterator(
    :items="items"
    :search="search.search"
    :sort-by="search.sortBy"
    :sort-desc="search.sortDesc"
  )
    template(v-slot:default="props")
      v-container.grid-list-lg.pa-0
        v-layout(wrap)
          v-flex(v-for="item in props.items" :key="item.id" xs12 sm6 md4 lg3)
            v-card
              v-img(:src="`/img/resources/${item.imageId}`" v-if="item.imageId")
                v-layout.nekotaku-title-on-image-container(align-end fill-height)
                  v-card-title.nekotaku-title-on-image.white--text.headline {{item.title}}
              v-card-title(v-else) {{item.title}}
              v-list(dense)
                v-list-item
                  v-list-item-content ゲーム:
                  v-list-item-content.align-end {{item.gameName}}
                v-list-item
                  v-list-item-content 作成者:
                  v-list-item-content.align-end
                    promise-value(:promise="item.userName")
                v-list-item
                  v-list-item-content 作成日時:
                  v-list-item-content.align-end {{item.createdAtText}}
              v-card-actions
                v-spacer
                v-btn(color="primary" :href="`/rooms/${item.id}`") 参加
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Prop } from 'vue-property-decorator';
import Document from 'nekotaku-core/types/Document';
import Room from 'nekotaku-core/types/Room';
import BCDice from 'bcdice';
import Search from '../types/Search';
import PromiseValue from './PromiseValue.vue';

type DiffKey<
  T extends string | number | symbol,
  U extends string | number | symbol
> = ({ [P in T]: P } & { [P in U]: never } & { [x: string]: never })[T];
type Omit<T, K extends keyof T> = Pick<T, DiffKey<keyof T, K>>;

type TableItem = Room &
  Omit<Document<void>, 'data'> & {
    userName: Promise<string>;
    createdAtText: string;
    gameName: string;
  };

@Component({
  components: {
    PromiseValue,
  },
})
export default class RoomListCard extends Vue {
  @Prop({ type: Object, required: true }) private search!: Search;

  private readonly rooms: Document<Room>[] = [
    {
      id: 'room01',
      createdAt: Date.now() - 5000,
      updatedAt: Date.now() - 5000,
      data: {
        title: '卓01',
        gameType: 'SwordWorld',
        characterParameterDefinitions: [],
      },
    },
    {
      id: 'room02',
      createdAt: Date.now() - 2500,
      updatedAt: Date.now() - 2500,
      data: {
        title: '卓02',
        gameType: 'SwordWorld2_0',
        characterParameterDefinitions: [],
      },
    },
    {
      id: 'room03',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      data: {
        title: '卓03',
        gameType: 'SwordWorld',
        characterParameterDefinitions: [],
        imageId: 'architecture-art-board-game-462180.jpg',
      },
    },
  ];

  private get items(): TableItem[] {
    return this.rooms.map(room => {
      const { data, ...others } = room;

      const { gameType } = data;

      const gameInfo = BCDice.infoList.find(game => game.gameType === gameType);
      const gameName = gameInfo ? gameInfo.gameName : gameType;

      return {
        ...others,
        ...data,
        userName: new Promise<string>(resolve =>
          setTimeout(() => resolve('ユーザー'), 1000),
        ), // ToDo
        createdAtText: moment(others.createdAt).format('lll'),
        gameName,
      };
    });
  }
}
</script>
<style scoped lang="stylus">
.nekotaku-title-on-image-container
  margin-top: 0 !important
.nekotaku-title-on-image
  background-color: rgba(0, 0, 0, 0.5);
  width: 100%;
</style>
