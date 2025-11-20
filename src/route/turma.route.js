const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/turma.controller")

const turmas = (app,base_route) => {
    app.get(base_route,userGuard("turma.Read"), ct.getAll)
    app.get(`${base_route}/:id`,userGuard("turma.Read"), ct.getOne)
    app.post(base_route,userGuard("turma.Create"), ct.create) 
    app.put(base_route,userGuard("turma.Update"), ct.update)
    app.delete(`${base_route}/:id`,userGuard("turma.Delete"), ct.remove)    
}

module.exports = turmas;