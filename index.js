const express = require("express") // import 
const app = express() // extend express
const cors = require("cors")
const cron = require('node-cron');
 
// allow origin (npm i cors)
app.use(cors({ //fixed "has been blocked by CORS policy" from client
    origin:"*"
}))

app.use(express.json())
app.get("/",(req,res)=>{ res.send("Hello API")})
app.use(express.urlencoded({ extended: true })); // necessário para FormData


// just import all
 const docentes = require("./src/route/docente.route") // import
 const estudantes = require("./src/route/estudante.route") // import
 const departamentos = require("./src/route/departamento.route") // import
 const cursos = require("./src/route/curso.route") // import
 const disciplinas = require("./src/route/disciplina.route") // import
 const turmas = require("./src/route/turma.route") // import
 const presencas = require("./src/route/presenca.route") // import
 const avaliacoes = require("./src/route/avaliacao.route") // import
 const contadores = require("./src/route/contadores.route") // import
 const matriculas = require("./src/route/matriculas.route") // import

 
// call
docentes(app,"/api/docentes")
estudantes(app,"/api/estudantes")
departamentos(app,"/api/departamentos")
cursos(app,"/api/cursos")
disciplinas(app,"/api/disciplinas")
turmas(app,"/api/turmas")
presencas(app,"/api/presencas")
avaliacoes(app,"/api/avaliacoes")
contadores(app,"/api/contadores")
matriculas(app,"/api/matriculas")



app.listen(8081,()=>{
    console.log("http localhost:8081")
})


