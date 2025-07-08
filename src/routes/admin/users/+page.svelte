<script>
  export let data;
  const users = data.users || [];
  let search = data.search || '';
</script>

<div class="admin-dashboard">
  <h1>Lista de Usuários</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  <form method="GET" class="search-form">
    <input type="text" name="search" placeholder="Buscar usuário, email ou nome..." bind:value={search} />
    <button type="submit">Buscar</button>
  </form>
  {#if users.length === 0}
    <p>Nenhum usuário encontrado.</p>
  {:else}
    <ul class="user-list">
      {#each users as user}
        <li class="user-item">
          <div><strong>{user.name}</strong> <span class="user-type">[{user.type}]</span></div>
          <div class="user-info">{user.username} &bull; {user.email}</div>
          <form method="POST" action="/admin/users/{user.id}/toggle-active" style="display:inline">
            <button type="submit" class="{user.is_active ? 'disable-btn' : 'enable-btn'}">
              {user.is_active ? 'Desativar' : 'Ativar'}
            </button>
          </form>
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
.back-btn {
  display: inline-block;
  margin-bottom: 1.5rem;
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
.back-btn:hover {
  background: #207520;
  color: #fff;
}
.search-form {
  display: flex;
  gap: 0.5em;
  margin-bottom: 1.2em;
}
.search-form input {
  flex: 1;
  padding: 0.5em;
  border-radius: 4px;
  border: 1px solid #ccc;
  font-size: 1em;
}
.search-form button {
  padding: 0.5em 1em;
  border-radius: 4px;
  border: none;
  background: #0066cc;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
}
.search-form button:hover {
  background: #004080;
}
.user-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
.user-item {
  background: #f7f7f7;
  border-radius: 6px;
  margin-bottom: 1rem;
  padding: 1rem;
  text-align: left;
  font-size: 1rem;
}
.user-type {
  color: #0066cc;
  font-size: 0.95em;
  margin-left: 0.5em;
}
.user-info {
  color: #555;
  font-size: 0.95em;
  margin-top: 0.2em;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
  .user-item {
    font-size: 0.98rem;
    padding: 0.7rem;
  }
}
</style>
