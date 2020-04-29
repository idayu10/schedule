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
          {{ user.userId }}
        </v-col>
        <v-col align-self="end" :cols="9">
          <v-row>
            {{ date }}
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
          <suggest-input
            v-model="item.timeSchedule"
            mode="schedule"
            :time="item.targetTime"
            :user-num="user.userNum"
            :word-source="wordSource"
          ></suggest-input>
        </v-col>
        <v-col class="add-border">
          <suggest-input
            v-model="item.timeResult"
            mode="result"
            :time="item.targetTime"
            :user-num="user.userNum"
            :word-source="wordSource"
          ></suggest-input>
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
import {UserData, UserDataImpl} from '@/model/user-data'
import {WordSource} from '@/model/word-source'
import {HistoryData, HistoryDataImpl} from '@/model/history-data'
import {Suggest, SuggestImpl} from '@/model/suggest'

@Component({
  components: {
    SuggestInput :() => import('@/components/SuggestInput.vue'),
  }
})
export default class Main extends Vue{

  /** ユーザーデータ */
  user: UserData = new UserDataImpl();
  /** スケジュールデータ */
  schedules: TimeSchedule [] = [];
  /** スケジュールを表示する日付 */
  date: string = new Date().toISOString().substr(0, 10);
  /** サジェスト用データ */
  wordSource: WordSource[] = [];

  /** ロード中フラグ */
  loading: boolean = false;
  /** カレンダー表示フラグ */
  showCalendar: boolean = false;
  /** 深夜表示フラグ */
  show0To5: boolean = false;

  async created(): Promise<void> {
    // 直接入ってきた場合はログイン画面に遷移
    this.user = this.$store.state['login-state'].user;
    if (!this.user.userId) {
      this.$router.push('/');
    }
    this.refleshSuggest();
    this.searchSchedule();
  }

  /**
   * サジェスト用データベースをリフレッシュする
   */
  async refleshSuggest(): Promise<void> {
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/reflesh-suggest';
    return this.$axios.get(url)
      .then(response => {
      }).catch( error => {
        console.log("response error", error);
      });
  }

  /**
   * スケジュールを検索する
   */
  async searchSchedule(): Promise<void> {
    this.loading = true;
    this.getWordSource();
    const yyyyymmdd: string = this.date.replace(/-/g, '');
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/date';
    return this.$axios.get(url,{
        params: {
          user: this.user.userNum,
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

  /**
   * サジェストデータを取得する
   */
  private async getWordSource(): Promise<void> {
    this.$axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
    const url:string = 'schedule-api/schedule/suggest-all';
    return this.$axios.get(url, {
        params: {
          user: this.user.userNum
        }
      })
      .then(response => {
        this.wordSource = response.data;
      }).catch( error => {
        console.log("response error", error);
      });
  }

  /**
   * スケジュールデータが存在しない場合に作成する
   * @param {string} yyyymmdd - 日付
   */
  private makeSchedule(yyyymmdd: string): void {
    if (this.schedules == null || this.schedules.length !== 24) {
      this.schedules = [];
      for (let i = 0; i < 24; i++) {
        const schedule = new TimeScheduleImpl();
        schedule.userNum = this.user.userNum;
        schedule.targetDate = yyyymmdd;
        schedule.targetTime = ('00' + i.toString()).slice(-2);
        this.schedules.push(schedule);
      }
    }
  }

  /**
   * スケジュールを登録する
   */
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
