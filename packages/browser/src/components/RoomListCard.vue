<template lang="pug">
  v-data-iterator(
    :items="rooms"
    :search="search.search"
    :sort-by="search.sortBy"
    :sort-desc="search.sortDesc"
  )
    template(v-slot:default="props")
      v-container.grid-list-lg.pa-0
        v-layout(wrap)
          v-flex(v-for="item in props.items" :key="item.id" xs12 sm6 md4 lg3)
            room-card(collapse-description :room="item")
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import Document from 'nekotaku-core/types/Document';
import Room from 'nekotaku-core/types/Room';
import Search from '../types/Search';
import RoomCard from './RoomCard.vue';

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
    RoomCard,
  },
})
export default class RoomListCard extends Vue {
  @Prop({ type: Object, required: true }) private search!: Search;

  private readonly rooms: Document<Room>[] = [
    {
      id: 'room01',
      userId: 'local',
      createdAt: Date.now() - 3 * 60 * 1000,
      updatedAt: Date.now() - 3 * 60 * 1000,
      data: {
        title: '卓01',
        gameType: 'SwordWorld',
        characterParameterDefinitions: [],
      },
    },
    {
      id: 'room02',
      userId: 'local',
      createdAt: Date.now() - 1.5 * 60 * 1000,
      updatedAt: Date.now() - 1.5 * 60 * 1000,
      data: {
        title: '卓02',
        gameType: 'SwordWorld2_0',
        characterParameterDefinitions: [],
      },
    },
    {
      id: 'room03',
      userId: 'local',
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
}
</script>
