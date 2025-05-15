import { useState } from 'react'
import { signUp } from '../lib/auth'

export default function Registro() {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleRegistro = async (e) => {
    e.preventDefault()
    setError('')

    const { success, error } = await signUp(email, password, nome)
    
    if (success) {
      // Redirecionar para página de login ou dashboard
      window.location.href = '/login'
    } else {
      setError(error)
    }
  }

  return (
    <form onSubmit={handleRegistro}>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button type="submit">Registrar</button>
    </form>
  )
} 