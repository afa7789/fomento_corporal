
<script>
  export let data;
  const admins = data.admins || [];
</script>

<div class="admin-dashboard">
  <h1>Lista de Admins</h1>
  <div class="admin-actions-header">
    <a href="/admin" class="back-btn">← Voltar</a>
    <a href="/admin/admins/new" class="create-btn">+ Novo Admin</a>
  </div>
  {#if admins.length === 0}
    <p>Nenhum admin encontrado.</p>
  {:else}
    <ul class="admin-list">
      {#each admins as admin}
        <li class="admin-item">
          <div><strong>{admin.name}</strong></div>
          <div class="admin-info">{admin.username} &bull; {admin.email}</div>
          <div class="admin-actions">
            <a href={`/admin/admins/${admin.id}/edit`} class="edit-btn">Editar</a>
            <form method="POST" action={`/admin/admins/${admin.id}/toggle-active`} style="display:inline;">
              <button type="submit" class={admin.is_active ? 'disable-btn' : 'enable-btn'}>
                {admin.is_active ? 'Desativar' : 'Ativar'}
              </button>
            </form>
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
    margin-bottom: 1.2rem;
    text-transform: uppercase;
    letter-spacing: 1px;
  }
  .admin-actions-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.5rem;
    gap: 1rem;
  }
  .back-btn, .create-btn {
    display: inline-block;
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
  .back-btn:hover, .create-btn:hover {
    background: #207520;
    color: #fff;
  }
  .admin-list {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .admin-item {
    background: #f7f7f7;
    border-radius: 6px;
    margin-bottom: 1rem;
    padding: 1rem;
    text-align: left;
    font-size: 1rem;
  }

  .admin-info {
    color: #555;
    font-size: 0.95em;
    margin-top: 0.2em;
  }
  .admin-actions {
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
  .edit-btn:hover {
    background: #0050a0;
  }
  .disable-btn {
    background: #a00;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.4em 1em;
    font-size: 0.98em;
    cursor: pointer;
  }
  .disable-btn:hover {
    background: #d00;
  }
  .enable-btn {
    background: #207520;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 0.4em 1em;
    font-size: 0.98em;
    cursor: pointer;
  }
  .enable-btn:hover {
    background: #38b738;
  }
  @media (max-width: 600px) {
    .admin-dashboard {
      padding: 8px;
      max-width: 98vw;
    }
    .admin-actions-header {
      flex-direction: column;
      gap: 0.5rem;
    }
  }
</style>
