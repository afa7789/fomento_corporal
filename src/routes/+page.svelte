<script lang="ts">
  export let data: { allowPublicTrainings?: boolean };
</script>

<div class="home-container">
  <h1>FOMENTO CORPORAL</h1>

  {#if data.allowPublicTrainings}
    <a href="/public-trainings" class="public-link">Ver treinos públicos</a>
  {/if}
  <a href="/login" class="login-button">ENTRAR</a>
</div>

<style>
  .public-link {
    display: inline-block;
    margin-bottom: 1.2rem;
    border-radius: 6px;
    padding: 0.7rem 1.2rem;
    text-decoration: none;
    font-weight: 500;
    font-size: 1.1rem;
    transition: background 0.2s, color 0.2s;
  }
  .public-link:hover {
    color: #fff;
  }
  .home-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 20px;
    text-align: center;
  }
  
  h1 {
    font-size: 2.5rem;
    margin-bottom: 2rem;
    color: #000;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
  
  .login-button {
    display: inline-block;
    padding: 15px 30px;
    background: #000;
    color: #fff;
    text-decoration: none;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: 1.2rem;
    border: none;
    cursor: pointer;
    width: 200px;
  }
  
  .login-button:hover {
    background: #fff;
    color: #000;
    border: 3px solid #000;
    width: 200px;
  }
  
  @media (max-width: 768px) {
    h1 {
      font-size: 2rem;
    }
    
    .login-card {
      padding: 20px;
      width: 100%;
      max-width: 300px;
    }
  }
</style>
