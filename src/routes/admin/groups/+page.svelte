<script>
  export let groups = [];
</script>

<div class="admin-dashboard">
  <h1>Grupos</h1>
  <a href="/admin" class="back-btn">← Voltar ao dashboard</a>
  <a href="/admin/groups/new" class="create-btn">+ Novo Grupo</a>
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
</style>
