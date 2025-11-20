const { TOKEN_KEY } = require("../util/service");
const jwt = require("jsonwebtoken");
const db = require("../util/db");



exports.userGuard = (parameter) => {
    return (req, res, next) => {
        const authorization = req.headers.authorization;
        let token_from_client = null;

        if (authorization) {
            token_from_client = authorization.split(" ")[1]; // Extrai o token
        }

        if (!token_from_client) {
            return res.status(401).send({
                message: 'Unauthorized',
            });
        }

        jwt.verify(token_from_client, TOKEN_KEY, (error, result) => {
            if (error) {
                return res.status(401).send({
                    message: 'Unauthorized',
                    error: error.message
                });
            }

            // Verifique se o resultado tem a propriedade id
            if (!result || !result.id) {
                return res.status(401).send({
                    message: 'Unauthorized, id not found!'
                });
            }

            req.user = result; // Salva os dados do usuário
            req.user_id = result.id; // Acesso ao id do usuário
            req.id = result.id; // Acesso ao id

            if (parameter === null || (result.permissions && result.permissions.includes(parameter))) {
                next(); // Permite o acesso
            } else {
                return res.status(403).send({
                    message: 'Unauthorized',
                });
            }
        });
    };
};


exports.userGuardV1 = (req, res, next) => { // get access token from the client
    var authorization = req.headers.authorization; // token from the client
    var token_from_client = null;
    if (authorization != null && authorization != "") {
        token_from_client = authorization.split(" "); // authorization: "Bearer lkjsljrl;kjsiejr;lqjl;ksjdfakljs;ljl;r"
        token_from_client = token_from_client[1];
    }
    if (token_from_client == null) {
        res.status(401).send({
            message: 'Unauthorized',
        });
    } else {
        jwt.verify(token_from_client, TOKEN_KEY, (error, result) => {
            if (error) {
                res.status(401).send({
                    message: 'Unauthorized',
                    error: error
                });
            } else {
                // check if it has permission 
                var permission = result.data.permission; // get permission array from verify token
                req.user = result.data; // write user property 
                req.user_id = result.data.user.id;
                next();
            }
        });
    }
}

exports.getPermissionUser = async (id) => {
    const sql = `
        SELECT p.codigo
        FROM docente m
        INNER JOIN acesso a ON m.acesso_id = a.id
        INNER JOIN acesso_permissao ap ON a.id = ap.acesso_id
        INNER JOIN permissao p ON ap.permissao_id = p.id
        WHERE m.id_docente = ?`;

    const list = await db.query(sql, [id]);
    return list.map(item => item.codigo); // Retorna os códigos de permissão
};



