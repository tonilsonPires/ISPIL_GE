const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/disciplina.controller")

const disciplinas = (app,base_route) => {
    app.get(base_route,userGuard("disciplina.Read"), ct.getAll)
    app.get(`${base_route}/:id`,userGuard("disciplina.Read"), ct.getOne)
    app.post(base_route,userGuard("disciplina.Create"), ct.create) 
    app.put(base_route,userGuard("disciplina.Update"), ct.update)
    app.delete(`${base_route}/:id`,userGuard("disciplina.Delete"), ct.remove)    
}

module.exports = disciplinas;