const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");
const bcrypt = require('bcrypt');

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
    const sql = "SELECT * FROM estudante WHERE id_estudante = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({ message: error.message, error: true });
        } else {
            res.json({ list: row });
        }
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
                endereco, id_curso, ano_ingresso, status, senha
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

        const params = [
            nome, imagem, data_nascimento, sexo, telefone, email,
            endereco, id_curso, ano_ingresso, status || 'Ativo', hashedPassword
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
            nome, novaImagem, data_nascimento, sexo, telefone, email,
            endereco, id_curso, ano_ingresso, status, id_estudante
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

module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove
};