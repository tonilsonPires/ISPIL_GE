const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, txtSearch = "" } = req.query; // Padrões para página, limite e txtSearch
        const offset = (page - 1) * limit; // Cálculo do deslocamento
        
        // Constrói a consulta SQL com filtragem
        const sql = `
            SELECT c.*, d.nome AS departamento_nome 
            FROM curso c
            LEFT JOIN departamento d ON c.id_departamento = d.id_departamento
            WHERE c.nome LIKE ? OR d.nome LIKE ?  -- Filtragem pelo nome do curso ou departamento
            ORDER BY c.id_curso ASC
            LIMIT ? OFFSET ?`;

        const searchTerm = `%${txtSearch}%`; // Adiciona os curingas para busca
        const params = [searchTerm, searchTerm, parseInt(limit), parseInt(offset)];

        const list = await db.query(sql, params);

        // Contar total de cursos para calcular o número de páginas
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM curso c
            LEFT JOIN departamento d ON c.id_departamento = d.id_departamento
            WHERE c.nome LIKE ? OR d.nome LIKE ?`;
        
        const countResult = await db.query(countQuery, [searchTerm, searchTerm]);
        const totalRecord = countResult[0]?.total || 0;
        const totalPages = Math.ceil(totalRecord / limit); // Cálculo do total de páginas

        res.json({
            list,
            totalRecord,
            totalPages,
            currentPage: parseInt(page),
            queryData: req.query,
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Error!', error: e });
    }
};

// const getAll = async (req, res) => {
//     try {
//         const { page = 1, limit = 10 } = req.query; // Padrões para página e limite
//         const offset = (page - 1) * limit; // Cálculo do deslocamento

//         const sql = `
//             SELECT c.*, d.nome AS departamento_nome 
//             FROM curso c
//             LEFT JOIN departamento d ON c.id_departamento = d.id_departamento
//             ORDER BY c.id_curso ASC
//             LIMIT ? OFFSET ?`;

//         const list = await db.query(sql, [parseInt(limit), parseInt(offset)]);

//         // Contar total de cursos para calcular o número de páginas
//         const countQuery = "SELECT COUNT(*) AS total FROM curso";
//         const countResult = await db.query(countQuery);
//         const totalRecord = countResult[0]?.total || 0;
//         const totalPages = Math.ceil(totalRecord / limit); // Cálculo do total de páginas

//         res.json({
//             list,
//             totalRecord,
//             totalPages,
//             currentPage: parseInt(page),
//             queryData: req.query,
//         });
//     } catch (e) {
//         console.error(e);
//         res.status(500).send({ message: 'Internal Error!', error: e });
//     }
// };

const getOne = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM curso WHERE id_curso = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({ message: error.message, error: true });
        } else {
            res.json({ list: row });
        }
    });
};

const create = (req, res) => {
    const { nome, grau, duracao_meses, id_departamento } = req.body;

    const message = {};
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(grau)) message.grau = "grau é obrigatório!";
    if (isEmptyOrNull(duracao_meses)) message.duracao_meses = "duração em meses é obrigatória!";
    if (isEmptyOrNull(id_departamento)) message.id_departamento = "id_departamento é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.json({ error: true, message });
    }

    const sqlInsert = `
        INSERT INTO curso (nome, grau, duracao_meses, id_departamento) 
        VALUES (?, ?, ?, ?)`;

    const params = [nome, grau, duracao_meses, id_departamento];

    db.query(sqlInsert, params, (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: "Erro ao cadastrar curso: " + error.message });
        }

        res.json({ message: "Curso cadastrado com sucesso!", data: result });
    });
};

const update = (req, res) => {
    const { id_curso, nome, grau, duracao_meses, id_departamento } = req.body;

    const message = {};
    if (isEmptyOrNull(id_curso)) message.id_curso = "id_curso é obrigatório!";
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(grau)) message.grau = "grau é obrigatório!";
    if (isEmptyOrNull(duracao_meses)) message.duracao_meses = "duração em meses é obrigatória!";
    if (isEmptyOrNull(id_departamento)) message.id_departamento = "id_departamento é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlUpdate = `
        UPDATE curso 
        SET nome = ?, grau = ?, duracao_meses = ?, id_departamento = ? 
        WHERE id_curso = ?`;

    const params = [nome, grau, duracao_meses, id_departamento, id_curso];

    db.query(sqlUpdate, params, (error, row) => {
        if (error) {
            return res.status(500).json({ error: true, message: error.message });
        }

        res.json({
            message: row.affectedRows ? "Atualizado com sucesso!" : "Dados não encontrados!",
            data: row
        });
    });
};

const remove = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM curso WHERE id_curso = ?";
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