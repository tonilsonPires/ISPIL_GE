const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

// Método para obter todas as turmas
const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, txtSearch = "" } = req.query; // Extraindo parâmetros com valores padrão
        const offset = (page - 1) * limit; // Cálculo do deslocamento

        // Consulta SQL com filtro de pesquisa
        const sql = `
            SELECT t.*, d.nome AS docente_nome, c.nome AS curso_nome 
            FROM turma t
            LEFT JOIN docente d ON t.id_docente = d.id_docente
            LEFT JOIN curso c ON t.id_curso = c.id_curso
            WHERE d.nome LIKE ? OR t.codigo_turma LIKE ? 
            ORDER BY t.id_turma ASC
            LIMIT ? OFFSET ?`;

        const searchTerm = `%${txtSearch}%`; // Preparar o termo de busca

        const list = await db.query(sql, [searchTerm, searchTerm, parseInt(limit), parseInt(offset)]);

        // Contar total de turmas
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM turma t
            LEFT JOIN docente d ON t.id_docente = d.id_docente
            WHERE d.nome LIKE ? OR t.codigo_turma LIKE ?`;

        const countResult = await db.query(countQuery, [searchTerm, searchTerm]);
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
        console.error("Error fetching turmas:", e); // Mensagem de log detalhada
        res.status(500).send({ message: 'Error retrieving turmas', error: e.message });
    }
};

// Método para obter uma turma específica
const getOne = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM turma WHERE id_turma = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({ message: error.message, error: true });
        } else {
            res.json({ list: row });
        }
    });
};

const create = (req, res) => {
    const { id_docente, id_curso, ano, semestre, codigo_turma } = req.body;

    // Check for missing fields
    const message = {};
    if (!id_docente) message.id_docente = "id_docente é obrigatório!";
    if (!id_curso) message.id_curso = "id_curso é obrigatório!";
    if (!ano) message.ano = "ano é obrigatório!";
    if (!semestre) message.semestre = "semestre é obrigatório!";
    if (!codigo_turma) message.codigo_turma = "código da turma é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlInsert = `
        INSERT INTO turma (id_docente, id_curso, ano, semestre, codigo_turma) 
        VALUES (?, ?, ?, ?, ?)`;

    const params = [id_docente, id_curso, ano, semestre, codigo_turma];

    db.query(sqlInsert, params, (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: "Erro ao cadastrar turma: " + error.message });
        }

        res.json({ message: "Turma cadastrada com sucesso!", data: result });
    });
};


// // Método para criar uma nova turma
// const create = (req, res) => {
//     const { id_docente, id_curso, ano, semestre, codigo_turma } = req.body;

//     const message = {};
//     if (isEmptyOrNull(id_docente)) message.id_docente = "id_docente é obrigatório!";
//     if (isEmptyOrNull(id_curso)) message.id_curso = "id_curso é obrigatório!";
//     if (isEmptyOrNull(ano)) message.ano = "ano é obrigatório!";
//     if (isEmptyOrNull(semestre)) message.semestre = "semestre é obrigatório!";
//     if (isEmptyOrNull(codigo_turma)) message.codigo_turma = "código da turma é obrigatório!";

//     if (Object.keys(message).length > 0) {
//         return res.json({ error: true, message });
//     }

//     const sqlInsert = `
//         INSERT INTO turma (id_docente, id_curso, ano, semestre, codigo_turma) 
//         VALUES (?, ?, ?, ?)`;

//     const params = [id_docente, id_curso, ano, semestre, codigo_turma];

//     db.query(sqlInsert, params, (error, result) => {
//         if (error) {
//             return res.status(500).json({ error: true, message: "Erro ao cadastrar turma: " + error.message });
//         }

//         res.json({ message: "Turma cadastrada com sucesso!", data: result });
//     });
// };

// Método para atualizar uma turma
const update = (req, res) => {
    const { id_turma, id_docente, id_curso, ano, semestre, codigo_turma } = req.body;

    const message = {};
    if (isEmptyOrNull(id_turma)) message.id_turma = "id_turma é obrigatório!";
    if (isEmptyOrNull(id_docente)) message.id_docente = "id_docente é obrigatório!";
    if (isEmptyOrNull(id_curso)) message.id_curso = "id_curso é obrigatório!";
    if (isEmptyOrNull(ano)) message.ano = "ano é obrigatório!";
    if (isEmptyOrNull(semestre)) message.semestre = "semestre é obrigatório!";
    if (isEmptyOrNull(codigo_turma)) message.codigo_turma = "código da turma é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlUpdate = `
        UPDATE turma 
        SET id_docente = ?, id_curso = ?, ano = ?, semestre = ?, codigo_turma = ? 
        WHERE id_turma = ?`;

    const params = [id_docente, id_curso, ano, semestre, codigo_turma, id_turma];

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

// Método para remover uma turma
const remove = (req, res) => {
    const { id } = req.params;
    const sql = "DELETE FROM turma WHERE id_turma = ?";
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

// Novo método para obter todos os cursos
const getAllCursos = (req, res) => {
    const sql = "SELECT * FROM curso"; // Seleciona todos os cursos
    db.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ message: error.message, error: true });
        }
        res.json({ cursos: results });
    });
};

// Exportar os métodos
module.exports = {
    getAll,
    getOne,
    create,
    update,
    remove,
    getAllCursos // Expondo o novo método
};