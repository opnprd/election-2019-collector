<template>
  <article>
    <p>Results for {{ result.name }}.</p>
    <p>Ballots cast {{ result.ballots.cast }}</p>
  </article>
</template>
<script>
import AmplifyStore from '../store';

export default {
  data () {
    return {
      result: AmplifyStore.state.result,
    };
  }
}
</script>