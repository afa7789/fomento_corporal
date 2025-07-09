<script>
  import { onMount } from 'svelte';
  export let filePath;
  let proofText = '';
  let loading = true;
  onMount(async () => {
    try {
      const res = await fetch('/' + filePath);
      proofText = await res.text();
    } catch (e) {
      proofText = 'Erro ao carregar arquivo.';
    }
    loading = false;
  });
</script>

{#if loading}
  <span class="proof-loading">Carregando...</span>
{:else}
  <pre class="proof-text">{proofText}</pre>
{/if}

<style>
.proof-text {
  margin-top: 0.7rem;
  background: #fff;
  border: 1px solid #aaa;
  padding: 0.7em;
  font-family: monospace;
  font-size: 1em;
  white-space: pre-wrap;
  border-radius: 6px;
}
.proof-loading {
  color: #888;
  font-style: italic;
}
</style>
