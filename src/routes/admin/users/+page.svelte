<script>
  export let data;
  const users = data.users || [];
  let search = data.search || '';
</script>

<div class="admin-dashboard">
  <h1>Lista de Usuários</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  <a href="/admin/users/new" class="add-btn">+ Novo Usuário</a>
  <a href="/admin/users/inactive" class="add-btn" style="background:#a00;color:#fff;">Usuários Desativados</a>
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
          <div><strong>{user.name}</strong></div>
          <div class="user-info">{user.username} &bull; {user.email}</div>
          <button
            type="button"
            class={user.is_active ? 'disable-btn' : 'enable-btn'}
            on:click={async () => {
              const res = await fetch(`/admin/users/${user.id}/toggle-active`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ active: !user.is_active })
              });
              if (res.ok) {
                window.location.reload();
              } else {
                alert('Erro ao atualizar usuário');
              }
            }}
          >
            {user.is_active ? 'Desativar' : 'Ativar'}
          </button>
          {#if !user.is_active}
            <button
              type="button"
              class="enable-btn"
              on:click={async () => {
                const res = await fetch(`/admin/users/${user.id}/toggle-active`, {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ active: true })
                });
                if (res.ok) {
                  window.location.reload();
                } else {
                  alert('Erro ao ativar usuário');
                }
              }}
            >Ativar</button>
          {/if}
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
.add-btn {
  display: inline-block;
  margin-bottom: 1.5rem;
  margin-left: 1rem;
  color: #fff;
  background: #207520;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  text-decoration: none;
  font-weight: 500;
  font-size: 1rem;
  transition: background 0.2s, color 0.2s;
}
.add-btn:hover {
  background: #145014;
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
.user-info {
  color: #555;
  font-size: 0.95em;
  margin-top: 0.2em;
}
.disable-btn {
  background: #dc3545;
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}
.disable-btn:hover {
  background: #c82333;
}
.enable-btn {
  background: #28a745;
  color: white;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 0.5rem;
  margin-left: 0.5rem;
}
.enable-btn:hover {
  background: #218838;
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