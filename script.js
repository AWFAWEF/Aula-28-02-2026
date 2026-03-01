
function digits(v){return (v||"").replace(/\D/g,"")}

function maskCPF(v){
  let d = digits(v).slice(0,11)
  if(d.length > 3) d = d.slice(0,3) + "." + d.slice(3)
  if(d.length > 7) d = d.slice(0,7) + "." + d.slice(7)
  if(d.length > 11) d = d.slice(0,11) + "-" + d.slice(11)
  return d
}

function maskPhone(v){
  const d = digits(v).slice(0,11)
  if(d.length === 0) return ""
  if(d.length <= 2) return "(" + d
  if(d.length <= 7) return "(" + d.slice(0,2) + ") " + d.slice(2)
  return "(" + d.slice(0,2) + ") " + d.slice(2,7) + "-" + d.slice(7)
}

const form = document.getElementById("form")
const statusEl = document.getElementById("status")

let submitted = false
const touched = new Set()

const el = {
  nome: document.getElementById("nome"),
  idade: document.getElementById("idade"),
  cpf: document.getElementById("cpf"),
  contatoNome: document.getElementById("contatoNome"),
  telefone: document.getElementById("telefone"),
  queixa: document.getElementById("queixa"),
}

function setError(id, msg){
  const input = document.getElementById(id)
  const field = input.closest(".field")
  field.classList.add("invalid")
  input.setAttribute("aria-invalid","true")
  const err = document.getElementById("err-" + id)
  if(err) err.textContent = "⚠ " + msg
}

function clearError(id){
  const input = document.getElementById(id)
  const field = input.closest(".field")
  field.classList.remove("invalid")
  input.removeAttribute("aria-invalid")
  const err = document.getElementById("err-" + id)
  if(err) err.textContent = ""
}

function clearAll(){
  Object.keys(el).forEach(k => clearError(k))
  statusEl.textContent = ""
}

function validateField(id, show){
  if(!show){
    clearError(id)
    return true
  }

  if(id === "nome"){
    if(!el.nome.value.trim()){
      setError("nome","Informe o nome completo.")
      return false
    }
    clearError("nome")
    return true
  }

  if(id === "idade"){
    const idade = Number(el.idade.value)
    if(!el.idade.value.trim() || Number.isNaN(idade) || idade < 0 || idade > 130){
      setError("idade","Informe uma idade válida (0 a 130).")
      return false
    }
    clearError("idade")
    return true
  }

  if(id === "cpf"){
    if(digits(el.cpf.value).length !== 11){
      setError("cpf","CPF incompleto. Deve ter 11 dígitos.")
      return false
    }
    clearError("cpf")
    return true
  }

  if(id === "contatoNome"){
    if(!el.contatoNome.value.trim()){
      setError("contatoNome","Informe o nome do responsável.")
      return false
    }
    clearError("contatoNome")
    return true
  }

  if(id === "telefone"){
    if(digits(el.telefone.value).length < 10){
      setError("telefone","Telefone incompleto. Informe DDD e número.")
      return false
    }
    clearError("telefone")
    return true
  }

  if(id === "queixa"){
    if(!el.queixa.value.trim()){
      setError("queixa","Informe os sintomas/queixa principal.")
      return false
    }
    clearError("queixa")
    return true
  }

  return true
}

el.cpf.addEventListener("input", (e) => {
  e.target.value = maskCPF(e.target.value)
})

el.telefone.addEventListener("input", (e) => {
  e.target.value = maskPhone(e.target.value)
})

document.getElementById("limpar").addEventListener("click", () => {
  const ok = window.confirm("Tem certeza que deseja limpar o formulário?")
  if(!ok) return
  submitted = false
  touched.clear()
  form.reset()
  clearAll()
  statusEl.textContent = "Formulário limpo."
  el.nome.focus()
})

function validate(){
  let ok = true
  const ids = ["nome","idade","cpf","contatoNome","telefone","queixa"]
  ids.forEach((id) => {
    const show = submitted || touched.has(id)
    const r = validateField(id, show)
    if(show && !r) ok = false
  })
  if(!ok) statusEl.textContent = "Revise os campos marcados com ⚠."
  else statusEl.textContent = ""
  return ok
}

Object.keys(el).forEach((id) => {
  el[id].addEventListener("blur", () => {
    touched.add(id)
    validateField(id, true)
  })
  el[id].addEventListener("input", () => {
    if(submitted || touched.has(id)) validateField(id, true)
  })
})

form.addEventListener("submit", (e) => {
  e.preventDefault()
  submitted = true
  if(!validate()){
    const first = form.querySelector(".invalid input, .invalid textarea")
    if(first) first.focus()
    return
  }
  statusEl.textContent = "Admissão confirmada. Encaminhar para triagem."
})
