<template>
  <article>
    <p>Results for {{ result.name }}.</p>
    <h1>{{ summary }}</h1>
    <candidate-profile :image="winner.image" :name="winner.name" :party="winner.party_name" >
    </candidate-profile>

    <h2>Overall voting pattern</h2>
    <table>
      <thead>
        <tr><th>Measure</th><th>Votes</th><th>% of Total</th></tr>
      </thead>

      <tbody>
        <tr><td>Total</td><td>{{ result.ballots.total }}</td><td>&mdash;</td></tr>
        <tr><td>Valid</td><td>{{ result.ballots.valid }}</td><td>{{ proportion(result.ballots.valid) }}</td></tr>
        <tr><td>Margin</td><td>{{ margin }}</td><td>{{ proportion(margin) }}</td></tr>
        <tr><td>Spoiled</td><td>{{ result.ballots.spoiled }}</td><td>{{ proportion(result.ballots.spoiled) }}</td></tr>
      </tbody>
    </table>

    <h2>Candidate votes</h2>
    <table>
      <thead>
        <tr><th>Candidate</th><th>Party</th><th>Votes</th><th>Share</th></tr>
      </thead>
      <tbody>
        <tr v-for="r in votes" :key="r.id">
          <td>{{ r.name }}</td>
          <td>{{r.party_code}}</td>
          <td>{{ r.votes }}</td>
          <td>{{ proportion(r.votes) }}</td>
        </tr>
      </tbody>
    </table>

    <a class="action brand-background" v-if="published === false" v-on:click="$store.dispatch('publish')">Publish</a>
    <a class="action brand-background" v-if="published === true" target='tweet' :href="twitterUrl">Tweet it!</a>
  </article>
</template>
<style scoped>
table {
  width: 100%;
  font-size: 0.7em;
}
.action {
  padding: 0.5em;
  box-sizing: border-box;
  display: block;
}
</style>
</style>
<script>
import candidateProfile from './candidate-profile.vue';

export default {
  data () {
    return {
      tweet: ''
    };
  },
  components: {
    candidateProfile
  },
  computed: {
    result() {
      return this.$store.state.result;
    },
    votes() {
      return Object.entries(this.result.votes)
        .reduce((a, [id, votes = null]) => {
          const theCandidate = this.candidates[id];
          a.push({ ...theCandidate, id, votes });
          return a;
        }, [])
        .sort((a, b) => b.votes - a.votes);
    },
    candidates() {
      return this.$store.getters.getConstituency(this.result.id).candidates.reduce((a, v) => {
        a[v.id] = v;
        return a;
      }, {});    
    },
    winner() {
      return this.votes[0];
    },
    margin() {
      return this.votes[0].votes - this.votes[1].votes;
    },
    summary() {
      return `${ this.winner.party_name } win ${ this.result.name } by ${ this.margin } vote${this.margin === 1 ? '' : 's'}`;
    },
    twitterUrl() {
      return `https://twitter.com/intent/tweet?text=${ encodeURIComponent(this.summary) }`;
    },
    published() {
      return this.$store.state.published;
    } 
  },
  methods: {
    proportion(value) {
      return Math.round(100 * value / this.result.ballots.total) + '%';
    }
  }
}
</script>