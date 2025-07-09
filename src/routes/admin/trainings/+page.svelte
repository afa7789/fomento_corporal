<script>
  export let data;
  const trainings = data.trainings || [];
  let search = data.search || '';
</script>

<div class="admin-dashboard">
  <h1>Lista de Treinamentos</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  <form method="GET" class="search-form">
    <label for="search" class="search-label">Buscar por nome:</label>
    <input id="search" type="text" name="search" placeholder="Digite o nome..." bind:value={search} />
    <button type="submit">Buscar</button>
  </form>
  {#if trainings.length === 0}
    <p>Nenhum treinamento cadastrado.</p>
  {:else}
    <ul class="training-list">
      {#each trainings as t}
        <li class="training-item">
          <div><strong>{t.name}</strong></div>
          <div class="training-info">Arquivo: {t.file_path}</div>
          <div class="training-info">Criado por: {t.creator_name}</div>
          <div class="training-actions">
            <a href="/admin/trainings/{t.id}/edit" class="edit-btn">Editar</a>
            <button type="button" class="delete-btn" on:click={async () => {
              if (!confirm('Tem certeza que deseja excluir este treinamento?')) return;
              const res = await fetch(`/admin/trainings/${t.id}/delete`, { method: 'DELETE' });
              if (res.ok) {
                window.location.reload();
              } else {
                alert('Erro ao excluir treinamento');
              }
            }}>Excluir</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</div>

<style>
.admin-dashboard {
  max-width: 480px;
  margin: 32px auto;
  padding: 16px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}
.admin-dashboard h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.training-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.training-item {
  background: #f7f7f7;
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: left;
  font-size: 1rem;
}
.training-info {
  color: #555;
  font-size: 0.95em;
  margin-top: 0.2em;
}
.training-actions {
  margin-top: 0.7em;
}
.edit-btn {
  background: #0066cc;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4em 1em;
  margin-right: 0.5em;
  text-decoration: none;
  font-size: 0.98em;
}
.delete-btn {
  background: #a00;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4em 1em;
  font-size: 0.98em;
  cursor: pointer;
}
.delete-btn:hover {
  background: #d00;
}
  .search-form {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0.5em;
    margin-bottom: 1.2em;
    text-align: left;
  }
  .search-label {
    font-size: 1em;
    font-weight: 500;
    margin-bottom: 0.2em;
    color: #333;
  }
  .search-form input {
    padding: 0.5em;
    border-radius: 4px;
    border: 1px solid #ccc;
    font-size: 1em;
    margin-bottom: 0.2em;
  }
  .search-form button {
    padding: 0.5em 1em;
    border-radius: 4px;
    border: none;
    background: #0066cc;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    align-self: flex-start;
  }
  .search-form button:hover {
    background: #004080;
  }
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
.back-btn, .create-btn, .edit-btn {
  display: inline-block;
  margin: 0.5rem 0.5rem 1.5rem 0;
  color: #207520;
  background: #e6ffe6;
  border: 1px solid #b2e5b2;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}
.back-btn:hover, .create-btn:hover, .edit-btn:hover {
  background: #207520;
  color: #fff;
}
</style>
