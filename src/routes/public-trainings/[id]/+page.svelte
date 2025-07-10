<script lang="ts">
  import TextParser from '$lib/TextParser.svelte';
  export let data: { title: string; content: string };
</script>

<div class="training-page">
  <h1 class="brutalist-title">{data.title}</h1>
  <div class="brutalist-content">
    <TextParser textContent={data.content} />
  </div>
  <div>
    <br>
    <a href="/public-trainings" class="back-link">← Voltar à lista de treinos públicos</a>
  </div>
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
  padding: 0.5em 0.5em;
  text-align: center;
  font-size: 1.5rem;
  margin: 0 0 1.2rem 0;
  max-width: 900px;
  width: 100%;
  margin-left: auto;
  margin-right: auto;
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
.back-link {
  color: #888;
  text-decoration: underline;
  font-size: 0.97rem;
  text-align:left;
  cursor: pointer;
  background: none;
  border: none;
  margin: 20px;
  font-family: inherit;
  transition: color 0.2s;
  opacity: 0.7;
}
.back-link:hover {
  color: #222;
  opacity: 1;
  text-decoration: underline;
}
</style>
