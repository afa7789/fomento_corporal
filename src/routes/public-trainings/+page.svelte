<script lang="ts">
  export let data: { trainings: { id: number; name: string; description?: string }[] };
</script>

<div class="public-trainings-page">
  <div class="no-print back-link-container">
    <a href="/" class="back-link">← Voltar</a>
  </div>
  <h1>Treinos Públicos</h1>
  {#if data.trainings.length === 0}
    <div class="empty">Nenhum treino público disponível.</div>
  {:else}
    <ul class="public-trainings-list">
      {#each data.trainings as t}
        <li>
          <a class="public-training-link" href={"/public-trainings/" + t.id}>
            {t.name.toUpperCase()}
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
.public-trainings-page {
  max-width: 480px;
  margin: 32px auto;
  padding: 0 8px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}
.public-trainings-page h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.public-trainings-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
  align-items: stretch;
}

.public-training-link {
  display: block;
  width: 100%;
  padding: 1.1rem 0.5rem;
  font-size: 1.5rem;
  font-weight: bold;
  text-transform: uppercase;
  color: #111;
  background: none;
  border: none;
  border-radius: 0;
  text-decoration: underline;
  letter-spacing: 1px;
  transition: color 0.18s;
}

.back-link {
  color: #888;
  text-decoration: underline;
  font-size: 0.97rem;
  text-align:center;
  cursor: pointer;
  background: none;
  border: none;
  margin: 0 auto;
  font-family: inherit;
  transition: color 0.2s;
  opacity: 0.7;
}
.back-link:hover {
  color: #222;
  opacity: 1;
  text-decoration: underline;
}
 .back-link-container {
   max-width: 900px;
   margin: 2em auto 0 auto;
   text-align: center;
 }

.empty {
  color: #888;
  font-size: 1.1rem;
  margin-top: 2rem;
}
</style>
