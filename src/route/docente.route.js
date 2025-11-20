const { userGuard } = require("../controller/auth.controller")
const ct = require("../controller/docente.controller")
const { upload } = require("../util/config");
const docentes = (app,base_route) => {
    app.get(base_route,userGuard("docente.Read"),ct.getAll)
    app.get(base_route+"/:id",userGuard("docente.Read"),ct.getOne) // id params // req.params.id
    app.post(base_route, upload.single("imagem"),ct.create)
    app.put(base_route, upload.single("imagem"), userGuard("docente.Update"),ct.update)
    app.delete(`${base_route}/:id`,userGuard("docente.Delete"),ct.remove)
    app.post(`${base_route}_login`,ct.login)
    app.post(`${base_route}_set_password`,ct.setPassword)
    app.post(`${base_route}_refresh_token`,ct.refreshToken)
    
}
module.exports = docentes;
