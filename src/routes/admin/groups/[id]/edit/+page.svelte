<script>
  export let data;
  let group = data.group;
  let users = data.users ?? [];
  let name = group?.name ?? '';
  let selectedUsers = group?.users ? group.users.map(u => u.id) : [];
</script>

<div class="admin-dashboard">
  <h1>Editar Grupo</h1>
  <a href="/admin/groups" class="back-btn">← Voltar aos grupos</a>
  <form method="POST">
    <label>Nome do grupo:<br/>
      <input type="text" name="name" bind:value={name} required />
    </label>
    <br/>
    <label>Usuários:<br/>
      <div class="checkbox-list">
        {#each users as user}
          <label><input type="checkbox" name="users" value={user.id} bind:group={selectedUsers}> {user.name} ({user.username})</label>
        {/each}
      </div>
    </label>
    <br/>
    <button type="submit">Salvar</button>
  </form>
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
.checkbox-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem 1rem;
  margin-bottom: 0.5rem;
}
.checkbox-list label {
  display: flex;
  align-items: center;
  font-weight: normal;
  margin-right: 1rem;
  margin-bottom: 0.2rem;
  font-size: 1rem;
  cursor: pointer;
}
</style>
