<script>
  import { goto, invalidateAll } from '$app/navigation';
  export let data;
  // Reativo: sempre sincroniza com os dados do servidor
  $: groups = data.groups || [];
  $: search = data.search || '';

  async function handleSearch(e) {
    e?.preventDefault?.();
    const params = new URLSearchParams();
    if (search.trim()) {
      params.set('search', search.trim());
    }
    // Invalida todos os dados antes de navegar
    await invalidateAll();
    const url = `/admin/groups${params.toString() ? '?' + params.toString() : ''}`;
    await goto(url, { replaceState: false });
  }
</script>

<div class="admin-dashboard">
  <h1>Grupos</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  <a href="/admin/groups/new" class="create-btn">+ Novo Grupo</a>
  
  <form method="GET" class="search-form" on:submit={handleSearch}>
    <label for="search" class="search-label">Buscar grupo ou usuário:</label>
    <input id="search" type="text" name="search" placeholder="Digite para buscar..." bind:value={search} />
    <button type="submit">Buscar</button>
  </form>

  <table class="groups-table">
    <thead>
      <tr>
        <th>Nome</th>
        <th>Usuários</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      {#each groups as group}
        <tr>
          <td>{group.name}</td>
          <td>{group.users?.map(u => u.name).join(', ')}</td>
          <td>
            <a href={`/admin/groups/${group.id}/edit`} class="edit-btn">Editar</a>
            <form method="POST" action={`/admin/groups/${group.id}/delete`} style="display:inline;" on:submit={(e) => { if (!confirm('Tem certeza que deseja deletar este grupo?')) e.preventDefault(); }}>
              <button type="submit" class="delete-btn">Deletar</button>
            </form>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>

<style>
.admin-dashboard {
  max-width: 600px;
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

.delete-btn {
  background: #a00;
  color: #fff;
  border: none;
  border-radius: 4px;
  padding: 0.4em 1em;
  font-size: 0.98em;
  cursor: pointer;
  margin-left: 0.5em;
}

.delete-btn:hover {
  background: #d00;
}

.groups-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.groups-table th, .groups-table td {
  border: 1px solid #ccc;
  padding: 0.5rem;
  text-align: left;
}

.groups-table th {
  background: #f5f5f5;
  font-weight: bold;
}

@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
  
  .groups-table {
    font-size: 0.9em;
  }
}
</style>