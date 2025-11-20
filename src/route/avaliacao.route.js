const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/avaliacao.controller")

const avaliacoes = (app,base_route) => {
    app.get(base_route,userGuard("avaliacao.Read"), ct.getAll)
    app.get(`${base_route}/:id`,userGuard("avaliacao.Read"), ct.getOne)
    app.post(base_route,userGuard("avaliacao.Create"), ct.create) 
    app.put(base_route,userGuard("avaliacao.Update"), ct.update)
    app.delete(`${base_route}/:id`,userGuard("avaliacao.Delete"), ct.remove)    
}

module.exports = avaliacoes;