const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, txtSearch = "" } = req.query; // Padrões para página, limite e txtSearch
        const offset = (page - 1) * limit; // Cálculo do deslocamento

        // Constrói a consulta SQL com filtragem
        const sql = `
            SELECT d.*, c.nome AS curso_nome 
            FROM disciplina d
            LEFT JOIN curso c ON d.id_curso = c.id_curso
            WHERE d.nome LIKE ?  -- Filtragem pelo nome da disciplina
            ORDER BY d.id_disciplina ASC
            LIMIT ? OFFSET ?`;

        const searchTerm = `%${txtSearch}%`; // Adiciona os curingas para busca
        const params = [searchTerm, parseInt(limit), parseInt(offset)];

        const list = await db.query(sql, params);

        // Contar total de disciplinas para calcular o número de páginas
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM disciplina d
            WHERE d.nome LIKE ?`; // Contagem com filtragem
        
        const countResult = await db.query(countQuery, [searchTerm]);
        const totalRecord = countResult[0]?.total || 0; // Total de registros
        const totalPages = Math.ceil(totalRecord / limit); // Cálculo do total de páginas

        res.json({
            list,
            totalRecord,
            totalPages,
            currentPage: parseInt(page), // Página atual
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
//             SELECT d.*, c.nome AS curso_nome 
//             FROM disciplina d
//             LEFT JOIN curso c ON d.id_curso = c.id_curso
//             ORDER BY d.id_disciplina ASC
//             LIMIT ? OFFSET ?`;

//         const list = await db.query(sql, [parseInt(limit), parseInt(offset)]);

//         // Contar total de disciplinas para calcular o número de páginas
//         const countQuery = "SELECT COUNT(*) AS total FROM disciplina";
//         const countResult = await db.query(countQuery);
//         const totalRecord = countResult[0]?.total || 0; // Total de registros
//         const totalPages = Math.ceil(totalRecord / limit); // Cálculo do total de páginas

//         res.json({
//             list,
//             totalRecord,
//             totalPages,
//             currentPage: parseInt(page), // Página atual
//             queryData: req.query,
//         });
//     } catch (e) {
//         console.error(e);
//         res.status(500).send({ message: 'Internal Error!', error: e });
//     }
// };

const getOne = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM disciplina WHERE id_disciplina = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({ message: error.message, error: true });
        } else {
            res.json({ list: row });
        }
    });
};

const create = (req, res) => {
    const { nome, codigo, creditos, semestre, id_curso } = req.body;

    const message = {};
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(codigo)) message.codigo = "código é obrigatório!";
    if (isEmptyOrNull(semestre)) message.semestre = "semestre é obrigatório!";
    if (isEmptyOrNull(id_curso)) message.id_curso = "id_curso é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.json({ error: true, message });
    }

    const sqlInsert = `
        INSERT INTO disciplina (nome, codigo, creditos, semestre, id_curso) 
        VALUES (?, ?, ?, ?, ?)`;

    const params = [nome, codigo, creditos || 3, semestre, id_curso];

    db.query(sqlInsert, params, (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: "Erro ao cadastrar disciplina: " + error.message });
        }

        res.json({ message: "Disciplina cadastrada com sucesso!", data: result });
    });
};

const update = (req, res) => {
    const { id_disciplina, nome, codigo, creditos, semestre, id_curso } = req.body;

    const message = {};
    if (isEmptyOrNull(id_disciplina)) message.id_disciplina = "id_disciplina é obrigatório!";
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(codigo)) message.codigo = "código é obrigatório!";
    if (isEmptyOrNull(semestre)) message.semestre = "semestre é obrigatório!";
    if (isEmptyOrNull(id_curso)) message.id_curso = "id_curso é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlUpdate = `
        UPDATE disciplina 
        SET nome = ?, codigo = ?, creditos = ?, semestre = ?, id_curso = ? 
        WHERE id_disciplina = ?`;

    const params = [nome, codigo, creditos, semestre, id_curso, id_disciplina];

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
    const sql = "DELETE FROM disciplina WHERE id_disciplina = ?";
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