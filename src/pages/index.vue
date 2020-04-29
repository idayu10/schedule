<template>
  <v-form>
    <v-container>
      <!-- ローディングのアニメーション -->
      <div
        v-if="loading"
        id="is-loading"
      >
        <div id="loading">
          <img src="~/assets/img/loading.gif" alt="loading" />
        </div>
      </div>
      <!-- メイン -->
      <v-row justify="start">
        <v-col>
          <v-radio-group
            v-model="userNum"
            :mandatory="true"
            @change="searchSchedule"
          >
            <v-radio
              v-for="(user, index) in users"
              :key="index"
              :label="user.userId"
              :value="user.userNum"
            ></v-radio>
          </v-radio-group>
        </v-col>
        <v-col align-self="end" :cols="9">
          <v-row>
            {{date}}
            <v-icon @click="showCalendar = !showCalendar">mdi-calendar-month</v-icon>
          </v-row>
          <v-row v-show="showCalendar" justify="start">
            <v-date-picker
              v-model="date"
              no-title
              @input="searchSchedule"
            ></v-date-picker>
          </v-row>
        </v-col>
        <!-- <v-col></v-col>
        <v-col></v-col> -->
      </v-row>
      <v-row justify="start">
        <v-btn @click="show0To5 = !show0To5">
          0~5時を表示
        </v-btn>
      </v-row>
      <v-row justify="center">
        <v-col :cols="2" class="add-border">
          時間
        </v-col>
        <v-col class="add-border">
          予定
        </v-col>
        <v-col class="add-border">
          結果
        </v-col>
        <v-col class="add-border">
          ポイント
        </v-col>
      </v-row>
      <v-row
        justify="center"
        v-for="(item, index) in schedules"
        :key="index"
        v-show="5 < index || show0To5"
      >
        <v-col :cols="2" class="add-border">
          {{index+'-'+(index+1)}}
        </v-col>
        <v-col class="add-border">
          <v-menu
            allow-overflow
            bottom
            left
            offset-y
          >
            <template v-slot:activator="scope">
              <v-text-field
                v-model="item.timeSchedule"
                clearable
                @input="onInput($event)"
                @click="onFocus(item.targetTime, 'schedule', item, scope)"
                @keydown.native.delete="noSavehistory = true"
                @blur="onBlur(item.timeSchedule)"
              ></v-text-field>
            </template>
            <v-list v-show="suggests.length !== 0">
              <v-list-item-group>
                <v-list-item
                  v-for="(suggest, i) in suggests"
                  :key="i"
                  @click="item.timeSchedule = suggest.suggest"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="suggest.suggest"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-col>
        <v-col class="add-border">
          <v-menu
            allow-overflow
            bottom
            left
            offset-y
          >
            <template v-slot:activator="scope">
              <v-text-field
                v-model="item.timeResult"
                clearable
                @click="onFocus(item.targetTime, 'result', item, scope)"
                @keydown.native.delete="noSavehistory = true"
                @blur="onBlur(item.timeResult)"
              ></v-text-field>
            </template>
            <v-list v-show="suggests.length !== 0">
              <v-list-item-group>
                <v-list-item
                  v-for="(suggest, i) in suggests"
                  :key="i"
                  @click="item.timeSchedule = suggest.suggest"
                >
                  <v-list-item-content>
                    <v-list-item-title v-text="suggest.suggest"></v-list-item-title>
                  </v-list-item-content>
                </v-list-item>
              </v-list-item-group>
            </v-list>
          </v-menu>
        </v-col>
        <v-col class="add-border">
          <v-text-field
            v-model="item.timePoint"
            clearable
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <v-btn
            small
            @click="onSave"
          >
            保存
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import {TimeSchedule, TimeScheduleImpl} from '@/model/time-schedule'
import {UserData} from '@/model/user-data'
import {WordSource} from '@/model/word-source'
import {HistoryData, HistoryDataImpl} from '@/model/history-data'
import {Suggest, SuggestImpl} from '@/model/suggest'

@Component({
  components: {
    Logo :() => import('@/components/Logo.vue'),
  }
})
export default class Index extends Vue{

  users: UserData[] = [];
  schedules: TimeSchedule [] = [];
  date: string = new Date().toISOString().substr(0, 10);
  userNum: string = '';
  history: string[] = [];
  suggests: Suggest[] = [];
  wordSource: WordSource[] = [];
  suggestsTime: Suggest[] = [];

  loading: boolean = false;
  showCalendar: boolean = false;
  show0To5: boolean = false;
  noSavehistory: boolean = false;

  async created(): Promise<void> {
    this.getWordSource();
    await this.searchUser();
    this.searchSchedule();
  }

  private async getWordSource(): Promise<void> {
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/suggest-all';
    return this.$axios.get(url)
      .then(response => {
        this.wordSource = response.data;
      }).catch( error => {
        console.log("response error", error);
      });
  }

  async searchUser(): Promise<void> {
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/user';
    return this.$axios.get(url)
      .then(response => {
        this.users = response.data;
      }).catch( error => {
        console.log("response error", error);
      });
  }

  async searchSchedule(): Promise<void> {
    this.loading = true;
    const yyyyymmdd: string = this.date.replace(/-/g, '');
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/date';
    return this.$axios.get(url,{
        params: {
          user: this.userNum,
          date: yyyyymmdd
        }
      }).then(response => {
        this.schedules = response.data;
        this.makeSchedule(yyyyymmdd);
      }).catch( error => {
        console.log("response error", error);
      })
      .finally(() => {
        this.loading = false;
      });
  }

  private makeSchedule(yyyymmdd: string): void {
    if (this.schedules == null || this.schedules.length !== 24) {
      this.schedules = [];
      for (let i = 0; i < 24; i++) {
        const schedule = new TimeScheduleImpl();
        schedule.userNum = this.userNum;
        schedule.targetDate = yyyymmdd;
        schedule.targetTime = ('00' + i.toString()).slice(-2);
        this.schedules.push(schedule);
      }
    }
  }

  onInput(input: string): void {
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

  async onFocus(time: string, mode: string, item: TimeSchedule, scope: any): Promise<void> {
    if ('schedule' === mode) {
      this.noSavehistory = !!item.timeSchedule;
    } else {
      this.noSavehistory = !!item.timeResult;
    }

    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/suggest';
    return this.$axios.get(url,{
        params: {
          user: this.userNum,
          time: time,
          mode: mode
        }
      }).then(response => {
        this.suggestsTime = response.data;
        this.suggests = this.suggestsTime;
        scope.value = true;
      }).catch( error => {
        console.log("response error", error);
      });
  }

  async onBlur(word: string): Promise<void> {
    if (!this.noSavehistory && !!word) {
      const historyObj: HistoryData = new HistoryDataImpl();
      historyObj.word = word;
      historyObj.history = this.history;
      this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
      const url:string = 'schedule-api/schedule/history';
      await this.$axios.post(url, historyObj)
        .catch( error => {
          console.log("response error", error);
        });
    }
    this.noSavehistory = false;
    this.history = [];
  }

  onSave(): void {
    this.loading = true;
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/insert';
    this.$axios.post(url, this.schedules)
      .catch( error => {
        console.log(error);
      })
      .finally(() => {
        this.loading = false;
      });
  }
}
</script>
<style scoped>
.add-border {
  border: 0.5px solid;
  border-color: black;
}

#is-loading {
 display: block;
 position: fixed;
 width: 100%;
 height: 100%;
 top: 0px;
 left: 0px;
 background: rgb(15, 15, 15);
 opacity: 20%;
 z-index: 8;
}
#loading {
  position:fixed;
  left: 50%;
  top: 50%;
  border: 1px solid blue;
  width: 160px;
  height: 120px;
  margin-left: -80px;
  margin-top: -60px;
  text-align: center;
  color: black;
  z-index: 9;
}
</style>
