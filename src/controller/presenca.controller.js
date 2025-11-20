const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, id_turma } = req.query; // Padrões para página, limite e id_turma
        const offset = (page - 1) * limit; // Cálculo do deslocamento

        // Recuperar todas as turmas
        const turmas = await db.query("SELECT * FROM turma");

        // Recuperar as matrículas filtradas pelo id_turma, se fornecido
        let matriculasQuery = "SELECT m.*, e.nome AS estudante_nome FROM matricula m LEFT JOIN estudante e ON m.id_estudante = e.id_estudante";
        let matriculasParams = [];
        
        if (id_turma) {
            matriculasQuery += " WHERE m.id_turma = ?";
            matriculasParams.push(id_turma);
        }

        const matriculas = await db.query(matriculasQuery, matriculasParams);

        // Recuperar presenças com paginação
        const sql = `
            SELECT p.*, m.id_estudante, e.nome AS estudante_nome 
            FROM presenca p
            LEFT JOIN matricula m ON p.id_matricula = m.id_matricula
            LEFT JOIN estudante e ON m.id_estudante = e.id_estudante
            ${id_turma ? "WHERE m.id_turma = ?" : ""}
            ORDER BY p.id_presenca ASC
            LIMIT ? OFFSET ?`;

        const list = await db.query(sql, id_turma ? [id_turma, parseInt(limit), parseInt(offset)] : [parseInt(limit), parseInt(offset)]);

        // Contar total de presenças para calcular o número de páginas
        const countQuery = `SELECT COUNT(*) AS total FROM presenca p
            LEFT JOIN matricula m ON p.id_matricula = m.id_matricula
            ${id_turma ? "WHERE m.id_turma = ?" : ""}`;
        
        const countResult = await db.query(countQuery, id_turma ? [id_turma] : []);
        const totalRecord = countResult[0]?.total || 0; // Total de registros
        const totalPages = Math.ceil(totalRecord / limit); // Cálculo do total de páginas

        res.json({
            list,
            totalRecord,
            totalPages,
            currentPage: parseInt(page), // Página atual
            turmas, // Todas as turmas
            matriculas, // Matriculas filtradas por id_turma, se fornecido
            queryData: req.query,
        });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Error!', error: e });
    }
};

const getOne = (req, res) => {
    const id = req.params.id;
    const sql = "SELECT * FROM presenca WHERE id_presenca = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({ message: error.message, error: true });
        } else {
            res.json({ list: row });
        }
    });
};

const create = (req, res) => {
    const { id_matricula, data_aula, presente } = req.body;

    const message = {};
    if (isEmptyOrNull(id_matricula)) message.id_matricula = "id_matricula é obrigatório!";
    if (isEmptyOrNull(data_aula)) message.data_aula = "data_aula é obrigatória!";

    if (Object.keys(message).length > 0) {
        return res.json({ error: true, message });
    }

    const sqlInsert = `
        INSERT INTO presenca (id_matricula, data_aula, presente) 
        VALUES (?, ?, ?)`;

    const params = [id_matricula, data_aula, presente || false];

    db.query(sqlInsert, params, (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: "Erro ao cadastrar presença: " + error.message });
        }

        res.json({ message: "Presença cadastrada com sucesso!", data: result });
    });
};

const update = (req, res) => {
    const { id_presenca, id_matricula, data_aula, presente } = req.body;

    const message = {};
    if (isEmptyOrNull(id_presenca)) message.id_presenca = "id_presenca é obrigatório!";
    if (isEmptyOrNull(id_matricula)) message.id_matricula = "id_matricula é obrigatório!";
    if (isEmptyOrNull(data_aula)) message.data_aula = "data_aula é obrigatória!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlUpdate = `
        UPDATE presenca 
        SET id_matricula = ?, data_aula = ?, presente = ? 
        WHERE id_presenca = ?`;

    const params = [id_matricula, data_aula, presente, id_presenca];

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
    const sql = "DELETE FROM presenca WHERE id_presenca = ?";
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