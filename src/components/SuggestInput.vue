<template>
  <v-menu
    allow-overflow
    bottom
    left
    offset-y
  >
    <template v-slot:activator="scope">
      <v-text-field
        :value="value"
        clearable
        @input="onInput($event)"
        @click="onFocus(scope)"
        @keydown.native.delete="noSaveHistory = true"
        @blur="onBlur()"
      ></v-text-field>
    </template>
    <v-list v-show="suggests.length !== 0">
      <v-list-item-group>
        <v-list-item
          v-for="(suggest, i) in suggests"
          :key="i"
          @click="onSelect(suggest)"
        >
          <v-list-item-content>
            <v-list-item-title v-text="suggest.suggest"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-item-group>
    </v-list>
  </v-menu>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator';
import {TimeSchedule, TimeScheduleImpl} from '@/model/time-schedule'
import {UserData} from '@/model/user-data'
import {WordSource} from '@/model/word-source'
import {HistoryData, HistoryDataImpl} from '@/model/history-data'
import {Suggest, SuggestImpl} from '@/model/suggest'

@Component({})
export default class SuggestInput extends Vue{

  @Prop()
  value!: string;
  @Prop()
  mode!: string;
  @Prop()
  time!: string;
  @Prop()
  userNum!: string;
  @Prop()
  wordSource!: WordSource[];

  history: string[] = [];
  suggests: Suggest[] = [];
  suggestsTime: Suggest[] = [];

  noSaveHistory: boolean = false;

  onInput(input: string): void {
    this.$emit('input', input);
    this.history.push(input);

    if (!input) {
      this.suggests = this.suggestsTime;
      return;
    }
    const result: Suggest[] = [];
    this.wordSource.forEach(item => {
      const include: boolean = !!result.find(sug => {return sug.suggest === item.word});
      if (item.source.match(input) && !include) {
        const suggest = new SuggestImpl();
        suggest.suggest = item.word;
        result.push(suggest);
      }
    });
    this.suggests = result;
  }

  async onFocus(scope: any): Promise<void> {
    this.noSaveHistory = !!this.value;

    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/suggest';
    return this.$axios.get(url,{
        params: {
          user: this.userNum,
          time: this.time,
          mode: this.mode
        }
      }).then(response => {
        this.suggestsTime = response.data;
        this.suggests = this.suggestsTime;
        scope.value = true;
      }).catch( error => {
        console.log("response error", error);
      });
  }

  onSelect(item: Suggest): void {
    this.$emit('input', item.suggest);
  }

  async onBlur(): Promise<void> {
    if (!this.noSaveHistory && !!this.value) {
      const historyObj: HistoryData = new HistoryDataImpl();
      historyObj.userNum = this.userNum;
      historyObj.word = this.value;
      historyObj.history = this.history;
      this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      const url:string = 'schedule-api/schedule/history';
      await this.$axios.post(url, historyObj)
        .catch( error => {
          console.log("response error", error);
        });
    }
    this.noSaveHistory = false;
    this.history = [];
  }
}
</script>
<style scoped>
</style>
