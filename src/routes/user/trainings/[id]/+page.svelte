<script lang="ts">
  export let data: { title: string; content: string };
</script>

<div class="training-page">
  <h1 class="brutalist-title">{data.title}</h1>
  <pre class="brutalist-content">{data.content}</pre>
</div>

<style>
.training-page {
  font-family: monospace;
  background: white;
  min-height: 100vh;
}
.brutalist-title {
  font-family: monospace;
  background: #000;
  color: #fff;
  padding: 1em;
  text-align: center;
  font-size: 2rem;
  margin: 0 0 2rem 0;
}
.brutalist-content {
  font-family: monospace;
  border: 4px solid #000;
  padding: 2em;
  background: #fff;
  font-size: 1.1rem;
  white-space: pre-wrap;
  margin: 0 auto;
  max-width: 900px;
}
</style>
