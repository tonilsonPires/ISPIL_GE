const db = require("../util/db");
const { isEmptyOrNull, TOKEN_KEY, REFRESH_KEY } = require("../util/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPermissionUser } = require("./auth.controller");

const getAll = async (req, res) => {
    try {
        const { page = 1, txtSearch } = req.query;

        const param = [];
        const limitItem = 10;
        const offset = (page - 1) * limitItem;

        const select = `
            SELECT d.*, 
                   a.nome AS acesso_nome, 
                   di.nome AS disciplina_nome
        `;

        const join = `
            FROM docente d
            LEFT JOIN acesso a ON d.acesso_id = a.id
            LEFT JOIN disciplina di ON d.id_disciplina = di.id_disciplina
        `;

        let where = " WHERE 1=1 ";

        if (!isEmptyOrNull(txtSearch)) {
            where += " AND (d.nome LIKE ? OR d.telefone LIKE ? OR d.email LIKE ?)";
            param.push(`%${txtSearch}%`);
            param.push(`%${txtSearch}%`);
            param.push(`%${txtSearch}%`);
        }

        const order = " ORDER BY d.id_docente DESC ";
        const limit = ` LIMIT ? OFFSET ?`;

        const sql = select + join + where + order + limit;

        const list = await db.query(sql, [...param, limitItem, offset]);

        const countQuery = `SELECT COUNT(*) AS total ${join} ${where}`;
        const countResult = await db.query(countQuery, param);
        const totalRecord = countResult[0]?.total || 0;

        const acessoList = await db.query("SELECT * FROM acesso");
        const disciplinaList = await db.query("SELECT * FROM disciplina");

        res.json({
            list,
            totalRecord,
            acessoList,
            disciplinaList,
            queryData: req.query,
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({
            message: 'Internal Error!',
            error: e
        });
    }
};

const getOne = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM docente WHERE id_docente = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({
                message: error,
                error: true
            });
        } else {
            res.json({
                list: row
            });
        }
    });
};

const create = (req, res) => {
    const {
        nome,
        titulo,
        email,
        telefone,
        senha,
        acesso_id,
        id_disciplina,
    } = req.body;

    // Captura a imagem do req.file
    let imagem = null;
    if (req.file) {
        imagem = req.file.filename;
    }

    const message = {};
    if (isEmptyOrNull(nome)) { message.nome = "nome é obrigatório!"; }
    if (isEmptyOrNull(email)) { message.email = "email é obrigatório!"; }
    if (isEmptyOrNull(senha)) { message.senha = "senha é obrigatória!"; }
    if (isEmptyOrNull(acesso_id)) { message.acesso_id = "acesso_id é obrigatório!"; }
    if (isEmptyOrNull(id_disciplina)) { message.id_disciplina = "id_disciplina é obrigatório!"; }

    if (Object.keys(message).length > 0) {
        return res.json({
            error: true,
            message: message
        });
    }

    const sqlFind = "SELECT id_docente FROM docente WHERE telefone = ?";
    db.query(sqlFind, [telefone], (error1, result1) => {
        if (error1) {
            return res.status(500).json({
                error: true,
                message: "Erro na consulta: " + error1.message
            });
        }

        if (result1.length > 0) {
            return res.json({
                error: true,
                message: "O docente já existe!"
            });
        }

        const hashedPassword = bcrypt.hashSync(senha, 10);
        const sqlDocente = `
            INSERT INTO docente (
                nome, imagem, titulo, email, telefone, senha, 
                acesso_id, id_disciplina
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
        
        const paramDocente = [
            nome, imagem, titulo, email, telefone, hashedPassword, 
            acesso_id, id_disciplina
        ];

        db.query(sqlDocente, paramDocente, (error2, result2) => {
            if (error2) {
                return res.status(500).json({
                    error: true,
                    message: "Erro ao cadastrar docente: " + error2.message
                });
            }

            return res.json({
                message: "Docente cadastrado com sucesso!",
                data: result2
            });
        });
    });
};

const update = (req, res) => {
    const {
        id_docente,
        nome,
        titulo,
        email,
        telefone,
        acesso_id,
        id_disciplina,
    } = req.body;

    const message = {};
    if (isEmptyOrNull(id_docente)) { message.id_docente = "id_docente é obrigatório!"; }
    if (isEmptyOrNull(nome)) { message.nome = "nome é obrigatório!"; }
    if (isEmptyOrNull(email)) { message.email = "email é obrigatório!"; }
    if (isEmptyOrNull(acesso_id)) { message.acesso_id = "acesso_id é obrigatório!"; }
    if (isEmptyOrNull(id_disciplina)) { message.id_disciplina = "id_disciplina é obrigatório!"; }

    if (Object.keys(message).length > 0) {
        return res.json({
            error: true,
            message: message
        });
    }

    const sql = `
        UPDATE docente 
        SET nome = ?, imagem = ?, titulo = ?, email = ?, telefone = ?, 
            acesso_id = ?, id_disciplina = ? 
        WHERE id_docente = ?`;
    
    const param_sql = [
        nome, imagem, titulo, email, telefone, 
        acesso_id, id_disciplina, id_docente
    ];

    db.query(sql, param_sql, (error, row) => {
        if (error) {
            res.json({
                error: true,
                message: error
            });
        } else {
            res.json({
                message: row.affectedRows ? "Atualizado com sucesso!" : "Dados não encontrados!",
                data: row
            });
        }
    });
};

const remove = (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM docente WHERE id_docente = ?";
    db.query(sql, [id], (error, row) => {
        if (!error) {
            if (row.affectedRows) {
                res.json({
                    message: "Excluído com sucesso!",
                    data: row
                });
            } else {
                res.json({
                    message: "Dados não encontrados"
                });
            }
        } else {
            res.json({
                error: true,
                message: error.message
            });
        }
    });
};

const login = async (req, res) => {
    const { email, senha } = req.body;

    if (!email || !senha) {
        return res.json({
            error: true,
            message: "Email e senha são obrigatórios!"
        });
    }

    try {
        const [user] = await db.query("SELECT * FROM docente WHERE email = ?", [email]);

        if (user && await bcrypt.compare(senha, user.senha)) {
            const permissions = await getPermissionUser(user.id_docente);

            const token = jwt.sign({
                id: user.id_docente,
                username: user.email,
                permissions: permissions,
            }, TOKEN_KEY, { expiresIn: '15m' });

            const refreshToken = jwt.sign({
                id: user.id_docente,
                username: user.email,
            }, REFRESH_KEY, { expiresIn: '15m' });

            return res.json({
                message: "Login bem-sucedido!",
                token: token,
                refreshToken: refreshToken,
                user: { ...user, senha: undefined, permissions: permissions },
                error: false
            });
        } else {
            return res.json({
                message: "Senha incorreta ou conta não existe!",
                error: true
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Erro interno do servidor.",
            error: error.message
        });
    }
};

const refreshToken = async (req, res) => {
    const { refresh_key } = req.body;
    if (isEmptyOrNull(refresh_key)) {
        return res.status(401).send({
            message: 'Unauthorized',
        });
    } else {
        jwt.verify(refresh_key, REFRESH_KEY, async (error, result) => {
            if (error) {
                return res.status(401).send({
                    message: 'Unauthorized',
                    error: error
                });
            } else {
                const email = result.username;
                const user = await db.query("SELECT * FROM docente WHERE email = ?", [email]);
                const userInfo = user[0];
                delete userInfo.senha;
                const permissions = await getPermissionUser(userInfo.id_docente);
                const access_token = jwt.sign({ data: { ...userInfo, permissions } }, TOKEN_KEY, { expiresIn: "30s" });
                const new_refresh_token = jwt.sign({ data: { ...userInfo } }, REFRESH_KEY);

                res.json({
                    user: userInfo,
                    permissions,
                    access_token,
                    refresh_token: new_refresh_token,
                });
            }
        });
    }
};

const setPassword = async (req, res) => {
    const { email, senha } = req.body;
    const message = {};
    if (isEmptyOrNull(email)) { message.email = "Escreva o email, por favor!" }
    if (isEmptyOrNull(senha)) { message.senha = "Escreva a senha, por favor!" }
    if (Object.keys(message).length > 0) {
        return res.json({
            error: true,
            message: message
        });
    }

    const docentes = await db.query("SELECT * FROM docente WHERE email = ?", [email]);
    if (docentes.length > 0) {
        const passwordGenerate = bcrypt.hashSync(senha, 10);
        await db.query("UPDATE docente SET senha = ? WHERE email = ?", [passwordGenerate, email]);
        return res.json({
            message: "Senha alterada com sucesso!",
        });
    } else {
        return res.json({
            message: "A conta não existe! Por favor, registre-se!",
            error: true
        });
    }
};


module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    login,
    setPassword,
    refreshToken
};