<template lang="pug">
  v-card
    v-card-title
      div 卓を探す
    v-card-text
      form#nekotaku-room-search-form
        v-text-field(
          hide-details
          append-icon="mdi-search"
          label="キーワード"
          v-model="search"
        )
    v-data-table(
      sort-desc
      sort-by="createdAt"
      :headers="headers"
      :items="items"
      :search="search"
    )
      template(v-slot:item.createdAt="{ item }") {{item.createdAtText}}
      template(v-slot:item.action="{ item }")
        v-btn(color="primary" :href="`/rooms/${item.id}`") 参加
</template>

<script lang="ts">
import moment from 'moment';
import { Component, Vue, Prop } from 'vue-property-decorator';
import Document from 'nekotaku-core/types/Document';
import Room from 'nekotaku-core/types/Room';
import BCDice from 'bcdice';

interface TableItem extends Room {
  id: string;
  title: string;
  gameType: string;
  gameName: string;
  createdAt: string;
}

@Component({
  components: {
  },
})
export default class RoomListCard extends Vue {
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
      },
    },
  ]

  private search: string | null = null;

  private readonly headers = [
    { value: 'title', text: 'タイトル' },
    { value: 'gameName', text: 'ゲーム' },
    { value: 'createdAt', text: '作成日時' },
    { value: 'action', text: '', align: 'center', sortable: false },
  ];

  private get items(): TableItem[] {
    return this.rooms.map((room) => {
      const {
        id,
        createdAt,
        data,
      } = room;

      const {
        gameType,
      } = data;

      const gameInfo = BCDice.infoList.find(game => game.gameType === gameType);
      const gameName = gameInfo ? gameInfo.gameName : gameType;

      return {
        ...data,
        id,
        gameName,
        createdAt,
        createdAtText: moment(createdAt).format('lll'),
      };
    });
  }
}
</script>
