const db = require("../util/db");
const { isEmptyOrNull } = require("../util/service");

const getAll = async (req, res) => {
    try {
        const { page = 1, limit = 10, txtSearch = "" } = req.query; // Padrões para página, limite e txtSearch
        const offset = (page - 1) * limit; // Cálculo do deslocamento
        
        // Constrói a consulta SQL com filtragem
        const sql = `
            SELECT * FROM departamento
            WHERE nome LIKE ?  -- Filtragem pelo nome do departamento
            ORDER BY id_departamento ASC
            LIMIT ? OFFSET ?`;

        const searchTerm = `%${txtSearch}%`; // Adiciona os curingas para busca
        const params = [searchTerm, parseInt(limit), parseInt(offset)];

        const list = await db.query(sql, params);

        // Contar total de departamentos para calcular o número de páginas
        const countQuery = `
            SELECT COUNT(*) AS total 
            FROM departamento
            WHERE nome LIKE ?`;  // Contagem com filtragem

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
//             SELECT * FROM departamento
//             ORDER BY id_departamento ASC
//             LIMIT ? OFFSET ?`;

//         const list = await db.query(sql, [parseInt(limit), parseInt(offset)]);

//         // Contar total de departamentos para calcular o número de páginas
//         const countQuery = "SELECT COUNT(*) AS total FROM departamento";
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
    const sql = "SELECT * FROM departamento WHERE id_departamento = ?";
    db.query(sql, [id], (error, row) => {
        if (error) {
            res.json({ message: error.message, error: true });
        } else {
            res.json({ list: row });
        }
    });
};

const create = (req, res) => {
    const { nome, sigla, descricao } = req.body;

    const message = {};
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(sigla)) message.sigla = "sigla é obrigatória!";

    if (Object.keys(message).length > 0) {
        return res.json({ error: true, message });
    }

    const sqlInsert = `
        INSERT INTO departamento (nome, sigla, descricao) 
        VALUES (?, ?, ?)`;

    const params = [nome, sigla, descricao];

    db.query(sqlInsert, params, (error, result) => {
        if (error) {
            return res.status(500).json({ error: true, message: "Erro ao cadastrar departamento: " + error.message });
        }

        res.json({ message: "Departamento cadastrado com sucesso!", data: result });
    });
};

const update = (req, res) => {
    const { id_departamento, nome, sigla, descricao } = req.body;

    const message = {};
    if (isEmptyOrNull(id_departamento)) message.id_departamento = "id_departamento é obrigatório!";
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(sigla)) message.sigla = "sigla é obrigatória!";

    if (Object.keys(message).length > 0) {
        return res.status(400).json({ error: true, message });
    }

    const sqlUpdate = `
        UPDATE departamento 
        SET nome = ?, sigla = ?, descricao = ? 
        WHERE id_departamento = ?`;

    const params = [nome, sigla, descricao, id_departamento];

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
    const sql = "DELETE FROM departamento WHERE id_departamento = ?";
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