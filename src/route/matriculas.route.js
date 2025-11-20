const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/matricula.controller")

const matriculas = (app,base_route) => {
    app.get(base_route,userGuard("matricula.Read"), ct.getAll)
    app.get(`${base_route}/:id`,userGuard("matricula.Read"), ct.getOne)
    app.post(base_route,userGuard("matricula.Create"), ct.create) 
    app.put(base_route,userGuard("matricula.Update"), ct.update)
    app.delete(`${base_route}/:id`,userGuard("matricula.Delete"), ct.remove)    
}

module.exports = matriculas;