<script>
  export let data;
  const user = data.user;
</script>

<div class="admin-dashboard">
  <h1>{user ? 'Editar Usuário' : 'Novo Usuário'}</h1>
  <form method="POST">
    <label>Usuário:<br/>
      <input type="text" name="username" required value={user?.username || ''} />
    </label>
    <br/><br/>
    <label>Senha:<br/>
      <input type="password" name="password" {user ? '' : 'required'} autocomplete="new-password" />
      {#if user}
        <small>Deixe em branco para não alterar</small>
      {/if}
    </label>
    <br/><br/>
    <label>Nome:<br/>
      <input type="text" name="name" required value={user?.name || ''} />
    </label>
    <br/><br/>
    <label>Email:<br/>
      <input type="email" name="email" required value={user?.email || ''} />
    </label>
    <br/><br/>
    <label>Tipo:<br/>
      <select name="type">
        <option value="user" selected={user?.type === 'user'}>Usuário</option>
        <option value="admin" selected={user?.type === 'admin'}>Admin</option>
      </select>
    </label>
    <br/><br/>
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
.admin-dashboard h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
}
</style>
