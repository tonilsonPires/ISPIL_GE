const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/curso.controller")

const cursos = (app,base_route) => {
    app.get(base_route, ct.getAll)
    app.get(`${base_route}/:id`,userGuard("curso.Read"), ct.getOne)
    app.post(base_route,userGuard("curso.Create"), ct.create) 
    app.put(base_route,userGuard("curso.Update"), ct.update)
    app.delete(`${base_route}/:id`,userGuard("curso.Delete"), ct.remove)    
}

module.exports = cursos;