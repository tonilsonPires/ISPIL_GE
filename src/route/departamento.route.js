const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/departamento.controller")

const departamentos = (app,base_route) => {
    app.get(base_route,userGuard("departamento.Read"), ct.getAll)
    app.get(`${base_route}/:id`,userGuard("departamento.Read"), ct.getOne)
    app.post(base_route,userGuard("departamento.Create"), ct.create) 
    app.put(base_route,userGuard("departamento.Update"), ct.update)
    app.delete(`${base_route}/:id`,userGuard("departamento.Delete"), ct.remove)    
}

module.exports = departamentos;