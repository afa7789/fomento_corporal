<script>
  import '../../styles/login.css';
  
  // Get form data from page
  export let form = null;
</script>

<nav class="login-nav">
  <a href="/">← VOLTAR</a>
</nav>

<div class="login-container">
  <h1 class="login-title">LOGIN</h1>
  
  {#if form?.error}
    <div class="login-error">{form.error}</div>
  {/if}
  
  {#if form?.success}
    <div class="login-success">{form.success}</div>
  {/if}
  
  <div class="login-card">
    <form class="login-form" method="POST" action="?/login">
      <div class="login-form-group">
        <label for="username">USUÁRIO:</label>
        <input 
          type="text" 
          id="username" 
          name="username" 
          required 
          value={form?.username || ''}
          placeholder="Digite seu usuário"
        />
      </div>
      
      <div class="login-form-group">
        <label for="password">SENHA:</label>
        <input 
          type="password" 
          id="password" 
          name="password" 
          required
          placeholder="Digite sua senha"
        />
      </div>
      
      <button type="submit" class="login-button">ENTRAR</button>
    </form>
  </div>
</div>
