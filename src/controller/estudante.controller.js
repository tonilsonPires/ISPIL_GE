const db = require("../util/db");
const { isEmptyOrNull, TOKEN_KEY, REFRESH_KEY  } = require("../util/service");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const { getPermissionStudent } = require("./auth.controller");


const getAll = async (req, res) => {
    try {
        const { page = 1, txtSearch } = req.query;
        const param = [];
        const limitItem = 10;
        const offset = (page - 1) * limitItem;

        const select = `
            SELECT e.*, 
                   c.nome AS curso_nome
        `;

        const join = `
            FROM estudante e
            LEFT JOIN curso c ON e.id_curso = c.id_curso
        `;

        let where = " WHERE 1=1 ";

        if (!isEmptyOrNull(txtSearch)) {
            where += " AND (e.nome LIKE ? OR e.telefone LIKE ? OR e.email LIKE ?)";
            param.push(`%${txtSearch}%`, `%${txtSearch}%`, `%${txtSearch}%`);
        }

        const order = " ORDER BY e.id_estudante DESC ";
        const limit = ` LIMIT ? OFFSET ?`;

        const sql = select + join + where + order + limit;
        const list = await db.query(sql, [...param, limitItem, offset]);

        const countQuery = `SELECT COUNT(*) AS total ${join} ${where}`;
        const countResult = await db.query(countQuery, param);
        const totalRecord = countResult[0]?.total || 0;

        const cursoList = await db.query("SELECT * FROM curso");

        res.json({
            list,
            totalRecord,
            cursoList,
            queryData: req.query,
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Error!', error: e });
    }
};

const getOne = (req, res) => {
    const id = req.params.id;

    const sql = `
    SELECT 
        e.id_estudante,
        e.nome AS nome_estudante,
        e.email AS email_estudante,
        e.telefone AS telefone_estudante,
        e.sexo,
        e.status AS status_estudante,
        e.ano_ingresso,

        m.id_matricula,
        m.data_matricula,
        m.situacao AS situacao_matricula,

        t.id_turma,
        t.codigo_turma,
        t.ano AS turma_ano,
        t.semestre AS turma_semestre,

        c.id_curso,
        c.nome AS nome_curso,
        c.grau AS grau_curso,

        dis.id_disciplina,
        dis.nome AS nome_disciplina,
        dis.codigo AS codigo_disciplina,
        dis.creditos AS creditos_disciplina,
        dis.semestre AS semestre_disciplina,

        doc.id_docente,
        doc.nome AS nome_docente,
        doc.email AS email_docente,
        doc.telefone AS telefone_docente,
        doc.titulo AS titulo_docente,

        dep.id_departamento,
        dep.nome AS nome_departamento,
        dep.sigla AS sigla_departamento,

        p.id_presenca,
        p.data_aula,
        p.presente

    FROM estudante e
    LEFT JOIN matricula m ON m.id_estudante = e.id_estudante
    LEFT JOIN turma t ON t.id_turma = m.id_turma
    LEFT JOIN docente doc ON doc.id_docente = t.id_docente
    LEFT JOIN disciplina dis ON dis.id_disciplina = doc.id_disciplina
    LEFT JOIN curso c ON c.id_curso = dis.id_curso
    LEFT JOIN departamento dep ON dep.id_departamento = c.id_departamento
    LEFT JOIN presenca p ON p.id_matricula = m.id_matricula

    WHERE e.id_estudante = ?
    `;

    db.query(sql, [id], (error, rows) => {
        if (error) {
            return res.json({ message: error.message, error: true });
        }
        res.json({ list: rows });
    });
};



const create = (req, res) => {
    const {
        nome,
        data_nascimento,
        sexo,
        telefone,
        email,
        endereco,
        id_curso,
        ano_ingresso,
        status,
        senha
    } = req.body;

    const acesso_id = 3; // 🔴 Valor padrão fixo
    const imagem = req.file?.filename || null;

    const message = {};
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(sexo)) message.sexo = "sexo é obrigatório!";
    if (isEmptyOrNull(telefone)) message.telefone = "telefone é obrigatório!";
    if (isEmptyOrNull(email)) message.email = "email é obrigatório!";
    if (isEmptyOrNull(id_curso)) message.id_curso = "id_curso é obrigatório!";
    if (isEmptyOrNull(ano_ingresso)) message.ano_ingresso = "ano_ingresso é obrigatório!";
    if (isEmptyOrNull(senha)) message.senha = "senha é obrigatória!";

    if (Object.keys(message).length > 0) {
        return res.json({ error: true, message });
    }

    const sqlFind = "SELECT id_estudante FROM estudante WHERE telefone = ?";
    db.query(sqlFind, [telefone], (error1, result1) => {
        if (error1) {
            return res.status(500).json({ error: true, message: "Erro na consulta: " + error1.message });
        }

        if (result1.length > 0) {
            return res.json({ error: true, message: "O estudante já existe!" });
        }

        const hashedPassword = bcrypt.hashSync(senha, 10);
        const sqlInsert = `
            INSERT INTO estudante (
                nome, imagem, data_nascimento, sexo, telefone, email, 
                endereco, id_curso, ano_ingresso, status, senha, acesso_id
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            nome,
            imagem,
            data_nascimento,
            sexo,
            telefone,
            email,
            endereco,
            id_curso,
            ano_ingresso,
            status || 'Inativo',
            hashedPassword,
            acesso_id // 🔴 aqui entra o 3
        ];

        db.query(sqlInsert, params, (error2, result2) => {
            if (error2) {
                return res.status(500).json({ error: true, message: "Erro ao cadastrar estudante: " + error2.message });
            }

            res.json({ message: "Estudante cadastrado com sucesso!", data: result2 });
        });
    });
};

const update = (req, res) => {
    const {
        id_estudante,
        nome,
        data_nascimento,
        sexo,
        telefone,
        email,
        endereco,
        id_curso,
        ano_ingresso,
        status
    } = req.body;

    const message = {};
    if (isEmptyOrNull(id_estudante)) message.id_estudante = "id_estudante é obrigatório!";
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(sexo)) message.sexo = "sexo é obrigatório!";
    if (isEmptyOrNull(telefone)) message.telefone = "telefone é obrigatório!";
    if (isEmptyOrNull(email)) message.email = "email é obrigatório!";
    if (isEmptyOrNull(id_curso)) message.id_curso = "id_curso é obrigatório!";
    if (isEmptyOrNull(ano_ingresso)) message.ano_ingresso = "ano_ingresso é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlGetImage = "SELECT imagem FROM estudante WHERE id_estudante = ?";
    db.query(sqlGetImage, [id_estudante], (err, result) => {
        if (err || !result.length) {
            return res.status(500).json({ error: true, message: "Erro ao buscar estudante." });
        }

        const imagemAtual = result[0].imagem;
        const novaImagem = req.file?.filename || imagemAtual;

        const sqlUpdate = `
            UPDATE estudante 
            SET nome = ?, imagem = ?, data_nascimento = ?, sexo = ?, 
                telefone = ?, email = ?, endereco = ?, id_curso = ?, 
                ano_ingresso = ?, status = ?
            WHERE id_estudante = ?`;

        const params = [
            nome,
            novaImagem,
            data_nascimento,
            sexo,
            telefone,
            email,
            endereco,
            id_curso,
            ano_ingresso,
            status,
            id_estudante
        ];

        db.query(sqlUpdate, params, (error, row) => {
            if (error) {
                return res.status(500).json({ error: true, message: error.message });
            }

            res.json({
                message: row.affectedRows ? "Atualizado com sucesso!" : "Dados não encontrados!",
                data: row
            });
        });
    });
};

const remove = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM estudante WHERE id_estudante = ?";
    db.query(sql, [id], (error, row) => {
        if (!error) {
            if (row.affectedRows) {
                res.json({ message: "Excluído com sucesso!", data: row });
            } else {
                res.json({ message: "Dados não encontrados" });
            }
        } else {
            res.json({ error: true, message: error.message });
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
        const [user] = await db.query("SELECT * FROM estudante WHERE email = ?", [email]);

        if (user && await bcrypt.compare(senha, user.senha)) {
            const permissions = await getPermissionStudent(user.id_estudante);

            const token = jwt.sign({
                id: user.id_estudante,
                username: user.email,
                permissions: permissions,
            }, TOKEN_KEY, { expiresIn: '15m' });

            const refreshToken = jwt.sign({
                id: user.id_estudante,
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
                const user = await db.query("SELECT * FROM estudante WHERE email = ?", [email]);
                const userInfo = user[0];
                delete userInfo.senha;
                const permissions = await getPermissionStudent(userInfo.id_docente);
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

    const estudantes = await db.query("SELECT * FROM estudante WHERE email = ?", [email]);
    if (estudantes.length > 0) {
        const passwordGenerate = bcrypt.hashSync(senha, 10);
        await db.query("UPDATE estudante SET senha = ? WHERE email = ?", [passwordGenerate, email]);
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