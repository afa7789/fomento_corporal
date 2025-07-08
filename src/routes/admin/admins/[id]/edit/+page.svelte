<script>
  export let data;
  const admin = data.admin;
</script>

<div class="admin-dashboard">
  <h1>{admin ? 'Editar Admin' : 'Novo Admin'}</h1>
  <form method="POST">
    <label>Usuário:<br/>
      <input type="text" name="username" required value={admin?.username || ''} />
    </label>
    <br/><br/>
    <label>Senha:<br/>
      <input type="password" name="password" {admin ? '' : 'required'} autocomplete="new-password" />
      {#if admin}
        <small>Deixe em branco para não alterar</small>
      {/if}
    </label>
    <br/><br/>
    <label>Nome:<br/>
      <input type="text" name="name" required value={admin?.name || ''} />
    </label>
    <br/><br/>
    <label>Email:<br/>
      <input type="email" name="email" required value={admin?.email || ''} />
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
