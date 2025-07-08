<script>
  export let form;
</script>

<div class="admin-dashboard">
  <h1>Excluir Treinamento</h1>
  <form method="POST">
    <p>Tem certeza que deseja excluir este treinamento?</p>
    <button type="submit" class="delete-btn">Excluir</button>
    <a href="/admin/trainings" class="back-btn">Cancelar</a>
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
.delete-btn {
  background: #a00;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  font-size: 1rem;
  margin-right: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}
.delete-btn:hover {
  background: #d00;
}
.back-btn {
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
.back-btn:hover {
  background: #207520;
  color: #fff;
}
</style>
