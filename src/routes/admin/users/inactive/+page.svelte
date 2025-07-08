<script></script>
  export let data;
  const users = data.users || [];
</script>

<div class="admin-dashboard">
  <h1>Usuários Desativados</h1>
  <a href="/admin/users" class="back-btn">← Voltar à lista de ativos</a>
  {#if users.length === 0}
    <p>Nenhum usuário desativado.</p>
  {:else}
    <ul class="user-list">
      {#each users as user}
        <li class="user-item">
          <div><strong>{user.name}</strong></div>
          <div class="user-info">{user.username} &bull; {user.email}</div>
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
.enable-btn {
  background: #207520;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.4rem 1.2rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  margin-top: 0.5em;
}
.enable-btn:hover {
  background: #145014;
}
</style>
