<template lang="pug">
  v-progress-circular(indeterminate :size="20" v-if="value === null")
  div(v-else) {{value}}
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  components: {},
})
export default class PromiseValue extends Vue {
  @Prop({ required: true, type: Promise }) promise!: Promise<string>;
  private value: string | null = null;

  private async created(): Promise<void> {
    this.value = await this.promise;
  }
}
</script>
