const db = require("../util/db");
const { isEmptyOrNull, TOKEN_KEY, REFRESH_KEY } = require("../util/service");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { getPermissionUser } = require("./auth.controller");

const getAll = async (req, res) => {
    try {
        const { page = 1, txtSearch = "" } = req.query;

        const limitItem = 10;
        const offset = (page - 1) * limitItem;

        const params = [];
        let where = " WHERE 1=1 ";

        if (txtSearch.trim()) {
            where += ` AND (
                d.nome LIKE ? OR 
                d.email LIKE ? OR 
                d.telefone LIKE ? OR
                di.nome LIKE ? OR
                a.nome LIKE ?
            )`;
            const searchPattern = `%${txtSearch}%`;
            params.push(searchPattern, searchPattern, searchPattern, searchPattern, searchPattern);
        }

        // Consulta principal
        const sql = `
            SELECT d.*, 
                   a.nome AS acesso_nome, 
                   di.nome AS disciplina_nome
            FROM docente d
            LEFT JOIN acesso a ON d.acesso_id = a.id
            LEFT JOIN disciplina di ON d.id_disciplina = di.id_disciplina
            ${where}
            ORDER BY d.id_docente DESC
            LIMIT ? OFFSET ?
        `;

        const list = await db.query(sql, [...params, limitItem, offset]);

        // Total de registros para paginação
        const countQuery = `
            SELECT COUNT(*) AS total
            FROM docente d
            LEFT JOIN acesso a ON d.acesso_id = a.id
            LEFT JOIN disciplina di ON d.id_disciplina = di.id_disciplina
            ${where}
        `;
        const countResult = await db.query(countQuery, params);
        const totalRecord = countResult[0]?.total || 0;

        res.json({
            list,
            totalRecord,
            page: parseInt(page),
            limit: limitItem,
        });

    } catch (error) {
        console.error("Erro ao buscar docentes:", error);
        res.status(500).json({ error: true, message: "Erro interno do servidor." });
    }
};

const getOne = (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(id)) {
    return res.status(400).json({
      error: true,
      message: "ID do docente inválido."
    });
  }

  const sql = `
    SELECT 
        d.id_docente,
        d.nome AS nome_docente,
        d.email,
        d.telefone,
        d.titulo,

        dis.id_disciplina,
        dis.nome AS nome_disciplina,
        dis.codigo AS codigo_disciplina,

        c.id_curso,
        c.nome AS nome_curso,
        c.grau,

        dep.id_departamento,
        dep.nome AS nome_departamento,
        dep.sigla,

        t.id_turma,
        t.codigo_turma,
        t.ano,
        t.semestre
    FROM docente d
    INNER JOIN disciplina dis ON dis.id_disciplina = d.id_disciplina
    INNER JOIN curso c ON c.id_curso = dis.id_curso
    INNER JOIN departamento dep ON dep.id_departamento = c.id_departamento
    LEFT JOIN turma t ON t.id_docente = d.id_docente
    WHERE d.id_docente = ?;
  `;

  db.query(sql, [id], (error, rows) => {
    if (error) {
      console.error("Erro ao buscar docente:", error);
      return res.status(500).json({
        error: true,
        message: "Erro interno ao buscar o docente."
      });
    }

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        error: true,
        message: "Docente não encontrado."
      });
    }

    // Organizar os dados
    const docente = {
      id_docente: rows[0].id_docente,
      nome: rows[0].nome_docente,
      email: rows[0].email,
      telefone: rows[0].telefone,
      titulo: rows[0].titulo,
      disciplina: {
        id_disciplina: rows[0].id_disciplina,
        nome: rows[0].nome_disciplina,
        codigo: rows[0].codigo_disciplina,
      },
      curso: {
        id_curso: rows[0].id_curso,
        nome: rows[0].nome_curso,
        grau: rows[0].grau,
      },
      departamento: {
        id_departamento: rows[0].id_departamento,
        nome: rows[0].nome_departamento,
        sigla: rows[0].sigla,
      },
      turmas: rows
        .filter(r => r.id_turma !== null)
        .map(r => ({
          id_turma: r.id_turma,
          codigo_turma: r.codigo_turma,
          ano: r.ano,
          semestre: r.semestre,
        }))
    };

    return res.status(200).json({
      error: false,
      data: docente
    });
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

    if (isEmptyOrNull(id_docente)) message.id_docente = "id_docente é obrigatório!";
    if (isEmptyOrNull(nome)) message.nome = "nome é obrigatório!";
    if (isEmptyOrNull(email)) message.email = "email é obrigatório!";
    if (isEmptyOrNull(acesso_id)) message.acesso_id = "acesso_id é obrigatório!";
    if (isEmptyOrNull(id_disciplina)) message.id_disciplina = "id_disciplina é obrigatório!";

    if (Object.keys(message).length > 0) {
        return res.json({
            error: true,
            message
        });
    }

    // 👉 Captura da imagem enviada pelo Multer
    let imagem = null;
    if (req.file) {
        imagem = req.file.filename;
    }

    // 👉 SQL dinâmico (só atualiza imagem se foi enviada)
    let sql = `
        UPDATE docente SET
            nome = ?,
            titulo = ?,
            email = ?,
            telefone = ?,
            acesso_id = ?,
            id_disciplina = ?
    `;

    const param_sql = [
        nome,
        titulo,
        email,
        telefone,
        acesso_id,
        id_disciplina
    ];

    if (imagem) {
        sql += ", imagem = ?";
        param_sql.push(imagem);
    }

    sql += " WHERE id_docente = ?";
    param_sql.push(id_docente);

    db.query(sql, param_sql, (error, row) => {
        if (error) {
            return res.json({
                error: true,
                message: error
            });
        }

        res.json({
            message: row.affectedRows ? "Atualizado com sucesso!" : "Docente não encontrado!",
            data: row
        });
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