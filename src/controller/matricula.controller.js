const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, txtSearch = "" } = req.query;

        const offset = (page - 1) * limit; // Cálculo do deslocamento

        // Consulta SQL com filtro de pesquisa
        const sql = `
            SELECT m.*, e.nome AS estudante_nome, t.codigo_turma
            FROM matricula m
            LEFT JOIN estudante e ON m.id_estudante = e.id_estudante
            LEFT JOIN turma t ON m.id_turma = t.id_turma
            WHERE e.nome LIKE ? OR m.situacao LIKE ?
            ORDER BY m.id_matricula ASC
            LIMIT ? OFFSET ?`;

        // Adiciona '%' para o LIKE
        const searchTerm = `%${txtSearch}%`;
        
        const list = await db.query(sql, [searchTerm, searchTerm, parseInt(limit), parseInt(offset)]);

        // Contar total de matrículas para calcular o número de páginas
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM matricula m
            LEFT JOIN estudante e ON m.id_estudante = e.id_estudante
            WHERE e.nome LIKE ? OR m.situacao LIKE ?`;

        const countResult = await db.query(countQuery, [searchTerm, searchTerm]);
        const totalRecord = countResult[0]?.total || 0; // Total de registros
        const totalPages = Math.ceil(totalRecord / limit); // Cálculo do total de páginas

        // Obter todos os estudantes, cursos e turmas para facilitar a matrícula
        const estudantes = await db.query("SELECT * FROM estudante");
        const cursos = await db.query("SELECT * FROM curso");
        const turmas = await db.query("SELECT t.* FROM turma t");

        res.json({
            list,
            totalRecord,
            totalPages,
            currentPage: parseInt(page), // Página atual
            estudantes,
            cursos,
            turmas,
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
//             SELECT m.*, e.nome AS estudante_nome, t.codigo_turma, c.nome AS curso_nome
//             FROM matricula m
//             LEFT JOIN estudante e ON m.id_estudante = e.id_estudante
//             LEFT JOIN turma t ON m.id_turma = t.id_turma
//             LEFT JOIN curso c ON t.id_curso = c.id_curso
//             ORDER BY m.id_matricula ASC
//             LIMIT ? OFFSET ?`;

//         const list = await db.query(sql, [parseInt(limit), parseInt(offset)]);

//         // Contar total de matrículas para calcular o número de páginas
//         const countQuery = "SELECT COUNT(*) AS total FROM matricula";
//         const countResult = await db.query(countQuery);
//         const totalRecord = countResult[0]?.total || 0; // Total de registros
//         const totalPages = Math.ceil(totalRecord / limit); // Cálculo do total de páginas

//         // Obter todos os estudantes e cursos para facilitar a matrícula
//         const estudantes = await db.query("SELECT * FROM estudante");
//         const cursos = await db.query("SELECT * FROM curso");

//         // Obter todas as turmas disponíveis
//         const turmas = await db.query("SELECT t.*, c.nome AS curso_nome FROM turma t LEFT JOIN curso c ON t.id_curso = c.id_curso");

//         res.json({
//             list,
//             totalRecord,
//             totalPages,
//             currentPage: parseInt(page), // Página atual
//             estudantes,
//             cursos,
//             turmas,
//             queryData: req.query,
//         });
//     } catch (e) {
//         console.error(e);
//         res.status(500).send({ message: 'Internal Error!', error: e });
//     }
// };

const getOne = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM matricula WHERE id_matricula = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({ message: error.message, error: true });
        } else {
            res.json({ list: row });
        }
    });
};

const create = (req, res) => {
    const { id_estudante, id_turma, data_matricula, situacao } = req.body;

    const message = {};
    if (isEmptyOrNull(id_estudante)) message.id_estudante = "id_estudante é obrigatório!";
    if (isEmptyOrNull(id_turma)) message.id_turma = "id_turma é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.json({ error: true, message });
    }

    const sqlInsert = `
        INSERT INTO matricula (id_estudante, id_turma, data_matricula, situacao) 
        VALUES (?, ?, ?, ?)`;

    const params = [id_estudante, id_turma, data_matricula || new Date(), situacao || 'Ativa'];

    db.query(sqlInsert, params, (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: "Erro ao cadastrar matrícula: " + error.message });
        }

        res.json({ message: "Matrícula cadastrada com sucesso!", data: result });
    });
};

const update = (req, res) => {
    const { id_matricula, id_estudante, id_turma, data_matricula, situacao } = req.body;

    const message = {};
    if (isEmptyOrNull(id_matricula)) message.id_matricula = "id_matricula é obrigatório!";
    if (isEmptyOrNull(id_estudante)) message.id_estudante = "id_estudante é obrigatório!";
    if (isEmptyOrNull(id_turma)) message.id_turma = "id_turma é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlUpdate = `
        UPDATE matricula 
        SET id_estudante = ?, id_turma = ?, data_matricula = ?, situacao = ? 
        WHERE id_matricula = ?`;

    const params = [id_estudante, id_turma, data_matricula, situacao, id_matricula];

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
    const sql = "DELETE FROM matricula WHERE id_matricula = ?";
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