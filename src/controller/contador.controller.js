const db = require("../util/db");

// Controller para contar estudantes
const getEstudantesCount = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) AS total_estudantes FROM estudante";
        const [result] = await db.query(query);
        res.json({ total_estudantes: result.total_estudantes });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Error!', error: e });
    }
};

// Controller para contar docentes
const getDocentesCount = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) AS total_docentes FROM docente";
        const [result] = await db.query(query);
        res.json({ total_docentes: result.total_docentes });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Error!', error: e });
    }
};

// Controller para contar turmas
const getTurmasCount = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) AS total_turmas FROM turma";
        const [result] = await db.query(query);
        res.json({ total_turmas: result.total_turmas });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Error!', error: e });
    }
};

// Controller para contar cursos
const getCursosCount = async (req, res) => {
    try {
        const query = "SELECT COUNT(*) AS total_cursos FROM curso";
        const [result] = await db.query(query);
        res.json({ total_cursos: result.total_cursos });
    } catch (e) {
        console.error(e);
        res.status(500).send({ message: 'Internal Error!', error: e });
    }
};

module.exports = {
    getEstudantesCount,
    getDocentesCount,
    getTurmasCount,
    getCursosCount,
};