<script>
    import { page } from '$app/stores';
    $: user = $page.data.user;
</script>

<div class="admin-dashboard">
    <h1>PAINEL ADMINISTRADOR</h1>
    <nav class="admin-nav">
        <a href="/admin/training/new">Novo Treinamento</a>
        <a href="/admin/trainings">Listar Treinamentos</a>
        <a href="/admin/users">Listar Usuários</a>
        <a href="/admin/groups">Listar Grupos</a>
        <a href="/admin/admins">Listar Admins</a>
        <a href="/admin/payments">Pagamentos</a>
        <a href="/admin/payment-config">Configuração Pix</a>
    </nav>
    <form method="POST" action="/logout" class="logout-form" style="margin-top:2rem;">
        <button type="submit" class="logout-btn">SAIR</button>
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
.admin-nav {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.admin-nav a {
  display: block;
  padding: 1rem;
  background: #f0f0f0;
  border-radius: 6px;
  color: #222;
  text-decoration: none;
  font-weight: bold;
  font-size: 1.05rem;
  transition: background 0.2s;
}
.admin-nav a:hover {
  background: #000;
  color: #fff;
}
.logout-form {
  margin: 0;
}
.logout-btn {
  padding: 8px 16px;
  background: #000;
  color: #fff;
  border: 2px solid #000;
  font-weight: bold;
  text-transform: uppercase;
  cursor: pointer;
  border-radius: 6px;
}
.logout-btn:hover {
  background: #fff;
  color: #000;
}
@media (max-width: 600px) {
  .admin-dashboard {
    padding: 8px;
    max-width: 98vw;
  }
  .admin-nav a {
    font-size: 1rem;
    padding: 0.8rem;
  }
}
</style>
