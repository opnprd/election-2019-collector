<template>
  <article>
    <p>Results for {{ result.name }}.</p>
    <p>Ballots cast {{ result.ballots.cast }}</p>
    <section>
      <p>{{ summary }}</p>
      <p><img :src="winner.image" :alt="winner.name">{{ winner.name }}</p>
    </section>
    <ol>
      <li v-for="r in votes" :key="r.id">{{ r.name }} ({{r.party_name}}) {{ r.votes }} votes</li>
    </ol>
    <p v-if="result.spoiled > 0">There were {{ result.spoiled }} spoiled ballots</p>

    <a target='tweet' :href="twitterUrl">Tweet it!</a>
  </article>
</template>
<script>
import AmplifyStore from '../store';

export default {
  data () {
    return {
      result: AmplifyStore.state.result,
      tweet: ''
    };
  },
  computed: {
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
      return this.$root.constituencies.find(x => x.id === this.result.id).candidates.reduce((a, v) => {
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
    }    
  }
}
</script>