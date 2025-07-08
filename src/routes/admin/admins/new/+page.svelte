<script>
  export let data;
</script>

<div class="admin-dashboard">
  <h1>Novo Admin</h1>
  <a href="/admin/admins" class="back-btn">← Voltar à lista de admins</a>
  <form method="POST">
    <label>Usuário:<br/>
      <input type="text" name="username" required />
    </label>
    <br/><br/>
    <label>Senha:<br/>
      <input type="password" name="password" required autocomplete="new-password" />
    </label>
    <br/><br/>
    <label>Nome:<br/>
      <input type="text" name="name" required />
    </label>
    <br/><br/>
    <label>Email:<br/>
      <input type="email" name="email" required />
    </label>
    <br/><br/>
    <button type="submit">Adicionar</button>
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
</style>
