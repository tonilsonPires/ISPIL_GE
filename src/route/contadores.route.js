const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/contador.controller")

const contadores = (app,base_route) => {
    app.get(`${base_route}_totalEstudantes`,userGuard("contadores.Read"), ct.getEstudantesCount)
    app.get(`${base_route}_totalDocentes`,userGuard("contadores.Read"), ct.getDocentesCount)
    app.get(`${base_route}_totalTurmas`,userGuard("contadores.Read"), ct.getTurmasCount) 
    app.get(`${base_route}_totalCursos`,userGuard("contadores.Read"), ct.getCursosCount)   
}

module.exports = contadores;