<template lang="pug">
  div {{text}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import moment from 'moment';

@Component({
  components: {},
})
export default class Moment extends Vue {
  @Prop({ required: true, type: Number }) value!: number;
  @Prop({ required: false, type: String, default: 'lll' }) format!: string;

  private get text(): string {
    return moment(this.value).format(this.format);
  }
}
</script>
