const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/estudante.controller")
const { upload } = require("../util/config");
const estudantes = (app,base_route) => {
    app.get(base_route,userGuard("estudante.Read"),ct.getAll)
    app.get(base_route+"/:id",userGuard("estudante.Read"),ct.getOne) // id params // req.params.id
    app.post(base_route, upload.single("imagem"), userGuard("estudante.Create"),ct.create)
    app.put(base_route, upload.single("imagem"), userGuard("estudante.Update"),ct.update)
    app.delete(`${base_route}/:id`,userGuard("estudante.Delete"),ct.remove)
    // app.post(`${base_route}_login`,ct.login)
    // app.post(`${base_route}_set_password`,ct.setPassword)
    // app.post(`${base_route}_refresh_token`,ct.refreshToken)
    
}
module.exports = estudantes;