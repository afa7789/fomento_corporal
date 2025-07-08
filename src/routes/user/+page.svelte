<script>
    import { page } from '$app/stores';
    
    // Get user data from page data
    $: user = $page.data.user;
    $: trainings = $page.data.trainings || [];
    $: error = $page.data.error;
</script>

<div class="user-container">
    <div class="user-header">
        <h1>DASHBOARD USUÁRIO</h1>
        <form method="POST" action="/logout" class="logout-form">
            <button type="submit" class="logout-btn">SAIR</button>
        </form>
    </div>
    
    {#if user}
        <div class="welcome-card">
            <h2>BEM-VINDO, {user.name.toUpperCase()}</h2>
            <p>Tipo: <strong>USUÁRIO</strong></p>
        </div>
    {/if}
</div>

<div class="user-actions">
  <a class="user-action-btn" href="/user/payments">Ver Pagamentos</a>
  <a class="user-action-btn" href="/user/payments/new">Novo Pagamento</a>
</div>

<div class="user-main">
  <h1>SEUS TREINAMENTOS</h1>
  {#if error}
    <div class="error">{error}</div>
  {:else if trainings.length === 0}
    <div class="empty">Nenhum treinamento disponível.</div>
  {:else}
    <div class="trainings-grid">
      {#each trainings as t}
        <div class="training-card">
          <div class="training-title">{t.name}</div>
          <div class="training-desc">{t.description || 'Sem descrição.'}</div>
          <a class="training-btn" href={"/user/trainings/" + t.id}>VER</a>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style>
.user-container, .user-main {
  max-width: 480px;
  margin: 32px auto;
  padding: 0 8px;
  background: #fff;
  border-radius: 12px;
  text-align: center;
}
.user-main h1 {
  font-size: 1.5rem;
  margin-bottom: 2rem;
  text-transform: uppercase;
  letter-spacing: 1px;
}
.trainings-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  align-items: center;
}
.training-card {
  width: 100%;
  max-width: 420px;
  background: #f8f8f8;
  border-radius: 10px;
  box-shadow: 2px 2px 0 #000;
  border: 2px solid #000;
  padding: 1.2rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.7rem;
}
.training-title {
  font-size: 1.1rem;
  font-weight: 900;
  text-transform: uppercase;
  margin-bottom: 0.3rem;
}
.training-desc {
  font-size: 0.97rem;
  color: #222;
  margin-bottom: 0.7rem;
}
.training-btn {
  display: inline-block;
  text-align: center;
  font-weight: bold;
  background: #fff;
  color: #000;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 1px;
  transition: background 0.2s;
  box-shadow: 2px 2px 0 #000;
}
.training-btn:hover {
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
.user-actions {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  margin-bottom: 1.2rem;
  justify-content: center;
  align-items: center;
}
.user-action-btn {
  display: block;
  text-align: center;
  font-weight: bold;
  background: #fff;
  color: #000;
  border: 2px solid #000;
  border-radius: 6px;
  padding: 0.7rem 1.2rem;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1rem;
  letter-spacing: 1px;
  transition: background 0.2s;
  box-shadow: 2px 2px 0 #000;
}
.user-action-btn:hover {
  background: #000;
  color: #fff;
}
.welcome-card {
  border: 2px solid #000;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 18px;
  background: #f0f8ff;
  text-align: center;
}
.error {
  background: #f00;
  color: #fff;
  font-weight: bold;
  padding: 0.7rem;
  border: 2px solid #000;
  border-radius: 10px;
  margin-bottom: 1.2rem;
  text-align: center;
}
.empty {
  color: #000;
  background: #ff0;
  border: 2px solid #000;
  border-radius: 10px;
  padding: 1rem;
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
}
@media (max-width: 600px) {
  .user-container, .user-main {
    padding: 0 2px;
    max-width: 98vw;
  }
  .training-card {
    padding: 1rem 0.5rem;
  }
}
</style>
