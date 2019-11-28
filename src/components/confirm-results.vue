<template>
  <article>
    <p>Results for {{ result.name }}.</p>
    <p>Ballots cast {{ result.ballots.cast }}</p>
    <section>
      <p>{{ winner.party_name }} win {{ result.name }} by {{ margin }} votes</p>
      <p><img :src="winner.image" :alt="winner.name">{{ winner.name }}</p>
    </section>
    <ol>
      <li v-for="r in votes" :key="r.id">{{ r.name }} ({{r.party_name}}) {{ r.votes }} votes</li>
    </ol>
    <p v-if="result.spoiled > 0">There were {{ result.spoiled }} spoiled ballots</p>
  </article>
</template>
<script>
import AmplifyStore from '../store';

export default {
  data () {
    return {
      result: AmplifyStore.state.result,
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
    }
  }
}
</script>