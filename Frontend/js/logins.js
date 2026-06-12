const server = "http://localhost:8080"
const form = document.getElementById('formulario')

form.addEventListener('submit', async (e) => {
    e.preventDefault()

    const email = document.getElementById('email').value
    const senha = document.getElementById('senha').value

    const response = await fetch(`${server}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, senha })
    })

    const result = await response.json()
    if (response.ok) {
        alert(result.message)
        window.location.href = '../interno/produto.html'
    } else {
        alert(result.message)
    }
})