/*
 Navicat Premium Dump SQL

 Source Server         : base_rh
 Source Server Type    : MySQL
 Source Server Version : 101002 (10.10.2-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : ispil_db

 Target Server Type    : MySQL
 Target Server Version : 101002 (10.10.2-MariaDB)
 File Encoding         : 65001

 Date: 20/11/2025 08:39:13
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for acesso
-- ----------------------------
DROP TABLE IF EXISTS `acesso`;
CREATE TABLE `acesso`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `codigo` varchar(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `nome`(`nome` ASC) USING BTREE,
  UNIQUE INDEX `codigo`(`codigo` ASC) USING BTREE,
  INDEX `idx_acesso_codigo`(`codigo` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of acesso
-- ----------------------------
INSERT INTO `acesso` VALUES (1, 'Administrador', 'admin', '2025-10-30 13:29:06');
INSERT INTO `acesso` VALUES (2, 'Docente', 'docente', '2025-10-30 13:29:06');
INSERT INTO `acesso` VALUES (3, 'Estudante', 'estudante', '2025-10-30 13:29:06');

-- ----------------------------
-- Table structure for acesso_permissao
-- ----------------------------
DROP TABLE IF EXISTS `acesso_permissao`;
CREATE TABLE `acesso_permissao`  (
  `acesso_id` int NOT NULL,
  `permissao_id` int NOT NULL,
  PRIMARY KEY (`acesso_id`, `permissao_id`) USING BTREE,
  INDEX `permissao_id`(`permissao_id` ASC) USING BTREE,
  CONSTRAINT `acesso_permissao_ibfk_1` FOREIGN KEY (`acesso_id`) REFERENCES `acesso` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `acesso_permissao_ibfk_2` FOREIGN KEY (`permissao_id`) REFERENCES `permissao` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of acesso_permissao
-- ----------------------------
INSERT INTO `acesso_permissao` VALUES (1, 1);
INSERT INTO `acesso_permissao` VALUES (1, 2);
INSERT INTO `acesso_permissao` VALUES (1, 3);
INSERT INTO `acesso_permissao` VALUES (1, 4);
INSERT INTO `acesso_permissao` VALUES (1, 5);
INSERT INTO `acesso_permissao` VALUES (1, 6);
INSERT INTO `acesso_permissao` VALUES (1, 7);
INSERT INTO `acesso_permissao` VALUES (1, 8);
INSERT INTO `acesso_permissao` VALUES (1, 9);
INSERT INTO `acesso_permissao` VALUES (1, 10);
INSERT INTO `acesso_permissao` VALUES (1, 11);
INSERT INTO `acesso_permissao` VALUES (1, 12);
INSERT INTO `acesso_permissao` VALUES (1, 13);
INSERT INTO `acesso_permissao` VALUES (1, 14);
INSERT INTO `acesso_permissao` VALUES (1, 15);
INSERT INTO `acesso_permissao` VALUES (1, 16);
INSERT INTO `acesso_permissao` VALUES (1, 17);
INSERT INTO `acesso_permissao` VALUES (1, 18);
INSERT INTO `acesso_permissao` VALUES (1, 19);
INSERT INTO `acesso_permissao` VALUES (1, 20);
INSERT INTO `acesso_permissao` VALUES (1, 21);
INSERT INTO `acesso_permissao` VALUES (1, 22);
INSERT INTO `acesso_permissao` VALUES (1, 23);
INSERT INTO `acesso_permissao` VALUES (1, 24);
INSERT INTO `acesso_permissao` VALUES (1, 25);
INSERT INTO `acesso_permissao` VALUES (1, 26);
INSERT INTO `acesso_permissao` VALUES (1, 27);
INSERT INTO `acesso_permissao` VALUES (1, 28);
INSERT INTO `acesso_permissao` VALUES (1, 29);
INSERT INTO `acesso_permissao` VALUES (1, 30);
INSERT INTO `acesso_permissao` VALUES (1, 31);
INSERT INTO `acesso_permissao` VALUES (1, 32);
INSERT INTO `acesso_permissao` VALUES (1, 33);
INSERT INTO `acesso_permissao` VALUES (1, 34);
INSERT INTO `acesso_permissao` VALUES (1, 35);
INSERT INTO `acesso_permissao` VALUES (1, 36);
INSERT INTO `acesso_permissao` VALUES (1, 37);
INSERT INTO `acesso_permissao` VALUES (2, 1);
INSERT INTO `acesso_permissao` VALUES (2, 5);
INSERT INTO `acesso_permissao` VALUES (2, 9);
INSERT INTO `acesso_permissao` VALUES (2, 17);
INSERT INTO `acesso_permissao` VALUES (2, 21);
INSERT INTO `acesso_permissao` VALUES (2, 25);
INSERT INTO `acesso_permissao` VALUES (2, 29);
INSERT INTO `acesso_permissao` VALUES (2, 30);
INSERT INTO `acesso_permissao` VALUES (2, 31);
INSERT INTO `acesso_permissao` VALUES (2, 32);
INSERT INTO `acesso_permissao` VALUES (2, 33);
INSERT INTO `acesso_permissao` VALUES (2, 34);

-- ----------------------------
-- Table structure for avaliacao
-- ----------------------------
DROP TABLE IF EXISTS `avaliacao`;
CREATE TABLE `avaliacao`  (
  `id_avaliacao` int NOT NULL AUTO_INCREMENT,
  `id_matricula` int NOT NULL,
  `prova1` decimal(4, 2) NULL DEFAULT NULL,
  `prova2` decimal(4, 2) NULL DEFAULT NULL,
  `media_final` decimal(4, 2) GENERATED ALWAYS AS (round((`prova1` + `prova2`) / 2,2)) STORED NULL,
  `exame` decimal(4, 2) NULL DEFAULT NULL,
  `recurso` decimal(4, 2) NULL DEFAULT NULL,
  `resultado` enum('Aprovado','Reprovado','Exame','Recurso') CHARACTER SET latin1 COLLATE latin1_swedish_ci GENERATED ALWAYS AS (case when `media_final` >= 10 then 'Aprovado' when `media_final` >= 8 and `media_final` < 10 then 'Exame' when `media_final` < 8 then 'Reprovado' else 'Recurso' end) STORED NULL,
  PRIMARY KEY (`id_avaliacao`) USING BTREE,
  INDEX `id_matricula`(`id_matricula` ASC) USING BTREE,
  CONSTRAINT `avaliacao_ibfk_1` FOREIGN KEY (`id_matricula`) REFERENCES `matricula` (`id_matricula`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of avaliacao
-- ----------------------------
INSERT INTO `avaliacao` VALUES (3, 7, 12.00, 14.00, DEFAULT, 17.00, 19.00, DEFAULT);
INSERT INTO `avaliacao` VALUES (4, 7, 12.00, 12.00, DEFAULT, 12.00, 12.00, DEFAULT);
INSERT INTO `avaliacao` VALUES (5, 6, 1.00, 1.00, DEFAULT, 1.00, 1.00, DEFAULT);
INSERT INTO `avaliacao` VALUES (6, 7, 12.00, 12.00, DEFAULT, 12.00, 12.00, DEFAULT);

-- ----------------------------
-- Table structure for curso
-- ----------------------------
DROP TABLE IF EXISTS `curso`;
CREATE TABLE `curso`  (
  `id_curso` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `grau` enum('Licenciatura','Mestrado','Doutorado','Técnico Médio','Técnico Superior') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `duracao_meses` int NOT NULL,
  `id_departamento` int NOT NULL,
  `criado_em` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_curso`) USING BTREE,
  INDEX `id_departamento`(`id_departamento` ASC) USING BTREE,
  CONSTRAINT `curso_ibfk_1` FOREIGN KEY (`id_departamento`) REFERENCES `departamento` (`id_departamento`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of curso
-- ----------------------------
INSERT INTO `curso` VALUES (1, 'Engenharia Informática', 'Licenciatura', 48, 1, '2025-10-30 13:29:06');
INSERT INTO `curso` VALUES (2, 'Psicologia', 'Licenciatura', 48, 2, '2025-10-30 13:29:06');
INSERT INTO `curso` VALUES (4, 'Josemar', 'Mestrado', 22, 2, '2025-11-19 19:58:08');

-- ----------------------------
-- Table structure for departamento
-- ----------------------------
DROP TABLE IF EXISTS `departamento`;
CREATE TABLE `departamento`  (
  `id_departamento` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `sigla` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `descricao` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `criado_em` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_departamento`) USING BTREE,
  UNIQUE INDEX `nome`(`nome` ASC) USING BTREE,
  UNIQUE INDEX `sigla`(`sigla` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of departamento
-- ----------------------------
INSERT INTO `departamento` VALUES (1, 'Ciências Exatas', 'DCEp', 'Departamento de Ciências Exatas e Tecnologia', '2025-10-30 13:29:06');
INSERT INTO `departamento` VALUES (2, 'Ciências Humanas', 'DCH', 'Departamento de Ciências Humanas', '2025-10-30 13:29:06');
INSERT INTO `departamento` VALUES (3, 'Engenharia', 'ENG', 'Departamento de Engenharia', '2025-10-30 13:29:06');
INSERT INTO `departamento` VALUES (10, 'Ciências H', 'D', 'ssssssssssssss', '2025-11-19 12:29:25');
INSERT INTO `departamento` VALUES (12, 'Josemar', 'sss', 'ssssssssssssssssssss', '2025-11-19 19:57:54');

-- ----------------------------
-- Table structure for disciplina
-- ----------------------------
DROP TABLE IF EXISTS `disciplina`;
CREATE TABLE `disciplina`  (
  `id_disciplina` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `codigo` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `creditos` int NULL DEFAULT 3,
  `semestre` int NOT NULL,
  `id_curso` int NOT NULL,
  `criado_em` datetime NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id_disciplina`) USING BTREE,
  UNIQUE INDEX `codigo`(`codigo` ASC) USING BTREE,
  INDEX `id_curso`(`id_curso` ASC) USING BTREE,
  CONSTRAINT `disciplina_ibfk_1` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of disciplina
-- ----------------------------
INSERT INTO `disciplina` VALUES (1, 'Programação I', 'INF101', 6, 1, 1, '2025-10-30 13:29:06');
INSERT INTO `disciplina` VALUES (2, 'Introdução à Psicologia', 'PSI101', 6, 1, 2, '2025-10-30 13:29:06');
INSERT INTO `disciplina` VALUES (4, 'Matematica ', 'Mat01', 6, 1, 1, '2025-11-19 13:20:58');

-- ----------------------------
-- Table structure for docente
-- ----------------------------
DROP TABLE IF EXISTS `docente`;
CREATE TABLE `docente`  (
  `id_docente` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `imagem` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `titulo` enum('Licenciado','Mestre','Doutor','PhD') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'Licenciado',
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `telefone` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `senha` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `id_disciplina` int NOT NULL,
  `criado_em` datetime NULL DEFAULT current_timestamp(),
  `acesso_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id_docente`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `id_disciplina`(`id_disciplina` ASC) USING BTREE,
  INDEX `idx_docente_acesso`(`acesso_id` ASC) USING BTREE,
  CONSTRAINT `docente_ibfk_1` FOREIGN KEY (`acesso_id`) REFERENCES `acesso` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `docente_ibfk_2` FOREIGN KEY (`id_disciplina`) REFERENCES `disciplina` (`id_disciplina`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of docente
-- ----------------------------
INSERT INTO `docente` VALUES (1, 'Dr. Carlos Lucano', 'caminho/para/imagem/carlos_lucano.jpg', 'Doutor', 'carlos.lucano@gclucan.ao', '123456789', '$10$ZCu6pTIX7jKk4ZSC.eliYeh7xwYFiwqzCmQBBCcvb89gC8h3dvshq', 1, '2025-10-30 13:29:06', 1);
INSERT INTO `docente` VALUES (4, 'João Silva', NULL, 'Doutor', 'tinilson@tonisoft.com', '931641401', '$2b$10$kmHqLCkvTUFVpLNO6uebf.d0EiYjcHPRRndqJNSsCnmCj76jjeOz.', 2, '2025-11-10 22:10:57', 1);
INSERT INTO `docente` VALUES (5, 'Tonilson', '23c7f095-da81-40ae-9441-88b9b7ac26a9-1762813451110.jpg', 'Doutor', 'tonilson@gmail.com', '922218189', '$2b$10$rihNHzWJPuDZDfa.q5O2ruTTG678.46NPtmbzFg4MEr8HrJGUFx7.', 2, '2025-11-10 22:24:11', 1);
INSERT INTO `docente` VALUES (6, 'Tonilson', '23c7f095-da81-40ae-9441-88b9b7ac26a9-1762813526575.jpg', 'Doutor', 'tonilsonrijo@gmail.com', '9222181', '$2b$10$jr0.AOAE99UrQkXzYxgibezGuk.FjJecdyaSDt56RVXoa4Iuci4g.', 2, '2025-11-10 22:25:26', 1);
INSERT INTO `docente` VALUES (7, 'Tonilson Pires', NULL, 'Doutor', 'tonilsonrijo2@gmail.com', '93164145', '$2b$10$mdf7kWyzKQm9oLDXvafajes0FXeyHXnvnSPDb81y/uyTBcHZU1U/m', 2, '2025-11-11 00:18:58', 1);
INSERT INTO `docente` VALUES (8, 'Tonilson Pires', NULL, 'Mestre', 'tonilsonrijo3@gmail.com', '93164155', '$2b$10$jF5yAzMmdrbj1yDEfpUJJOQQXmlfA2eIL18.jYeaZhuTuEEgajuYi', 2, '2025-11-11 00:20:23', 2);
INSERT INTO `docente` VALUES (9, 'Tonilson Pires', NULL, 'Doutor', 'tonilsonrijo4@gmail.com', '931641409', '$2b$10$QdnFy2riAmKbAnqU506LZOohoPXA0ZNicHrT5yLJ1kef0MokgtLem', 2, '2025-11-11 00:27:24', 2);
INSERT INTO `docente` VALUES (10, 'Tonilson Pires', NULL, 'Mestre', 'tonilsonrijo5@gmail.com', '931641403', '$2b$10$Y3Zy3aZKgGUre9SsgT2SGe4wqvT/x8qkwGcBcra/zGjWp7McYwYee', 1, '2025-11-11 00:38:41', 1);
INSERT INTO `docente` VALUES (11, 'Tonilson Pires', NULL, 'Mestre', 'tonilsonrijo6@gmail.com', '931641111', '$2b$10$iWjldJNwLM9jeCVbfDrHTuq8JN.29sQhfazP2YH.QoJm67k3qzymW', 2, '2025-11-11 00:40:19', 2);
INSERT INTO `docente` VALUES (12, 'Tonilson Pires', NULL, 'Mestre', 'tonilsonrijo7@gmail.com', '931641112', '$2b$10$JyqBeWf3YBIBDvtHI2eNueILNyEj0YZofuk7g6Q/dSllDxSV35.aa', 1, '2025-11-11 00:43:25', 1);
INSERT INTO `docente` VALUES (13, 'Tonilson Pires', NULL, 'Mestre', 'tonilsonrijo8@gmail.com', '931641118', '$2b$10$qDVTbrjIzDXmXCOlbSTVpu1DfyE88BQVNkCZl.trWtj.vkpjqpyHe', 2, '2025-11-11 00:55:21', 1);

-- ----------------------------
-- Table structure for estudante
-- ----------------------------
DROP TABLE IF EXISTS `estudante`;
CREATE TABLE `estudante`  (
  `id_estudante` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `imagem` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `data_nascimento` date NULL DEFAULT NULL,
  `sexo` enum('Masculino','Feminino','Outro') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `telefone` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `email` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `endereco` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `id_curso` int NOT NULL,
  `ano_ingresso` year NOT NULL,
  `status` enum('Ativo','Inativo','Formado','Desistente') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'Ativo',
  `criado_em` datetime NULL DEFAULT current_timestamp(),
  `senha` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `acesso_id` int NULL DEFAULT NULL,
  PRIMARY KEY (`id_estudante`) USING BTREE,
  UNIQUE INDEX `email`(`email` ASC) USING BTREE,
  INDEX `id_curso`(`id_curso` ASC) USING BTREE,
  INDEX `idx_estudante_acesso`(`acesso_id` ASC) USING BTREE,
  CONSTRAINT `estudante_ibfk_1` FOREIGN KEY (`acesso_id`) REFERENCES `acesso` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `estudante_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of estudante
-- ----------------------------
INSERT INTO `estudante` VALUES (1, 'Ana Costa', 'caminho/para/imagem/ana_costa.jpg', '2002-05-12', 'Feminino', '999999999', 'ana.costa@estudante.gclucan.ao', 'Rua A, 123', 1, 2025, 'Ativo', '2025-10-30 13:29:06', 'senha123', 3);
INSERT INTO `estudante` VALUES (2, 'Bruno Pereira', 'caminho/para/imagem/bruno_pereira.jpg', '2001-08-15', 'Masculino', '888888888', 'bruno.pereira@estudante.gclucan.ao', 'Rua B, 456', 2, 2025, 'Ativo', '2025-10-30 13:29:06', 'senha123', 3);
INSERT INTO `estudante` VALUES (3, 'Matias', '23c7f095-da81-40ae-9441-88b9b7ac26a9-1762813451110.jpg', '2025-11-05', 'Masculino', '934343434', 'carlo444s.lucano@gclucan.ao', 'Rua B, 456', 2, 2025, 'Ativo', '2025-11-15 18:28:23', '$2b$10$VfHPwGUZiczw2TDfNYA.VOqT8S3DG/X2DrmcjCtOg5tuY6rUYFoW2', NULL);
INSERT INTO `estudante` VALUES (4, 'Tonilson Pires', '23c7f095-da81-40ae-9441-88b9b7ac26a9-1762813451110.jpg', '2025-11-06', 'Masculino', '931641401', 'carlo44455s.lucano@gclucan.ao', 'Talatona', 2, 2021, 'Ativo', '2025-11-15 18:30:24', '$2b$10$nP4UrBSgdmC73V.TUsVRteSk3qYmknDzKcPLDYaa2.CYZnXpdZIRu', NULL);
INSERT INTO `estudante` VALUES (5, 'Bora13', '23c7f095-da81-40ae-9441-88b9b7ac26a9-1762813451110.jpg', '2025-11-19', 'Feminino', '098777665', 'boran@gclucan.ao', '33 st 122 PP...', 2, 2025, 'Ativo', '2025-11-15 18:37:31', '$2b$10$5DgtQbW/mDja..fzgdEJmerhopsXfkpocF.pYiK3Ls1TOHjA/xdCS', NULL);
INSERT INTO `estudante` VALUES (6, 'Bora13', '23c7f095-da81-40ae-9441-88b9b7ac26a9-1762813451110.jpg', '2025-11-19', 'Masculino', '9511000', 'carlo889@gclucan.ao', '33 st 122 PP...', 2, 2025, 'Ativo', '2025-11-15 19:12:31', '$2b$10$ZMHRZ0Ry0VIhkGbj.osFG.HtX29Kdh6WPQAd5J/AqWrcs8y/3Twg.', NULL);
INSERT INTO `estudante` VALUES (7, 'Seque', '23c7f095-da81-40ae-9441-88b9b7ac26a9-1762813451110.jpg', '2025-11-19', 'Masculino', '9511009', 'seique@gclucan.ao', '33 st 122 PP...', 2, 2025, 'Ativo', '2025-11-15 19:15:16', '$2b$10$yTqyudrevm8Grh/F0j7LhO5XKACkMxP9kQ24P.TYQxI7Y78sws3T6', NULL);

-- ----------------------------
-- Table structure for matricula
-- ----------------------------
DROP TABLE IF EXISTS `matricula`;
CREATE TABLE `matricula`  (
  `id_matricula` int NOT NULL AUTO_INCREMENT,
  `id_estudante` int NOT NULL,
  `id_turma` int NOT NULL,
  `data_matricula` date NOT NULL DEFAULT curdate(),
  `situacao` enum('Ativa','Trancada','Concluída','Cancelada') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'Ativa',
  PRIMARY KEY (`id_matricula`) USING BTREE,
  UNIQUE INDEX `id_estudante`(`id_estudante` ASC, `id_turma` ASC) USING BTREE,
  INDEX `id_turma`(`id_turma` ASC) USING BTREE,
  CONSTRAINT `matricula_ibfk_1` FOREIGN KEY (`id_estudante`) REFERENCES `estudante` (`id_estudante`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `matricula_ibfk_2` FOREIGN KEY (`id_turma`) REFERENCES `turma` (`id_turma`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of matricula
-- ----------------------------
INSERT INTO `matricula` VALUES (6, 5, 11, '2025-10-29', 'Ativa');
INSERT INTO `matricula` VALUES (7, 4, 9, '2025-11-19', 'Ativa');
INSERT INTO `matricula` VALUES (8, 5, 9, '2025-11-05', 'Ativa');

-- ----------------------------
-- Table structure for permissao
-- ----------------------------
DROP TABLE IF EXISTS `permissao`;
CREATE TABLE `permissao`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `codigo` varchar(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `grupo` varchar(120) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `codigo`(`codigo` ASC) USING BTREE,
  INDEX `idx_permissao_codigo`(`codigo` ASC) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 38 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of permissao
-- ----------------------------
INSERT INTO `permissao` VALUES (1, 'Read', 'estudante.Read', 'estudante');
INSERT INTO `permissao` VALUES (2, 'Create', 'estudante.Create', 'estudante');
INSERT INTO `permissao` VALUES (3, 'Update', 'estudante.Update', 'estudante');
INSERT INTO `permissao` VALUES (4, 'Delete', 'estudante.Delete', 'estudante');
INSERT INTO `permissao` VALUES (5, 'Read', 'departamento.Read', 'departamento');
INSERT INTO `permissao` VALUES (6, 'Create', 'departamento.Create', 'departamento');
INSERT INTO `permissao` VALUES (7, 'Update', 'departamento.Update', 'departamento');
INSERT INTO `permissao` VALUES (8, 'Delete', 'departamento.Delete', 'departamento');
INSERT INTO `permissao` VALUES (9, 'Read', 'curso.Read', 'curso');
INSERT INTO `permissao` VALUES (10, 'Create', 'curso.Create', 'curso');
INSERT INTO `permissao` VALUES (11, 'Update', 'curso.Update', 'curso');
INSERT INTO `permissao` VALUES (12, 'Delete', 'curso.Delete', 'curso');
INSERT INTO `permissao` VALUES (13, 'Read', 'docente.Read', 'docente');
INSERT INTO `permissao` VALUES (14, 'Create', 'docente.Create', 'docente');
INSERT INTO `permissao` VALUES (15, 'Update', 'docente.Update', 'docente');
INSERT INTO `permissao` VALUES (16, 'Delete', 'docente.Delete', 'docente');
INSERT INTO `permissao` VALUES (17, 'Read', 'disciplina.Read', 'disciplina');
INSERT INTO `permissao` VALUES (18, 'Create', 'disciplina.Create', 'disciplina');
INSERT INTO `permissao` VALUES (19, 'Update', 'disciplina.Update', 'disciplina');
INSERT INTO `permissao` VALUES (20, 'Delete', 'disciplina.Delete', 'disciplina');
INSERT INTO `permissao` VALUES (21, 'Read', 'turma.Read', 'turma');
INSERT INTO `permissao` VALUES (22, 'Create', 'turma.Create', 'turma');
INSERT INTO `permissao` VALUES (23, 'Update', 'turma.Update', 'turma');
INSERT INTO `permissao` VALUES (24, 'Delete', 'turma.Delete', 'turma');
INSERT INTO `permissao` VALUES (25, 'Read', 'matricula.Read', 'matricula');
INSERT INTO `permissao` VALUES (26, 'Create', 'matricula.Create', 'matricula');
INSERT INTO `permissao` VALUES (27, 'Update', 'matricula.Update', 'matricula');
INSERT INTO `permissao` VALUES (28, 'Delete', 'matricula.Delete', 'matricula');
INSERT INTO `permissao` VALUES (29, 'Read', 'avaliacao.Read', 'avaliacao');
INSERT INTO `permissao` VALUES (30, 'Create', 'avaliacao.Create', 'avaliacao');
INSERT INTO `permissao` VALUES (31, 'Update', 'avaliacao.Update', 'avaliacao');
INSERT INTO `permissao` VALUES (32, 'Delete', 'avaliacao.Delete', 'avaliacao');
INSERT INTO `permissao` VALUES (33, 'Read', 'presenca.Read', 'presenca');
INSERT INTO `permissao` VALUES (34, 'Create', 'presenca.Create', 'presenca');
INSERT INTO `permissao` VALUES (35, 'Update', 'presenca.Update', 'presenca');
INSERT INTO `permissao` VALUES (36, 'Delete', 'presenca.Delete', 'presenca');
INSERT INTO `permissao` VALUES (37, 'Read', 'contadores.Read', 'contadores');

-- ----------------------------
-- Table structure for presenca
-- ----------------------------
DROP TABLE IF EXISTS `presenca`;
CREATE TABLE `presenca`  (
  `id_presenca` int NOT NULL AUTO_INCREMENT,
  `id_matricula` int NOT NULL,
  `data_aula` date NOT NULL,
  `presente` tinyint(1) NULL DEFAULT 0,
  PRIMARY KEY (`id_presenca`) USING BTREE,
  UNIQUE INDEX `id_matricula`(`id_matricula` ASC, `data_aula` ASC) USING BTREE,
  CONSTRAINT `presenca_ibfk_1` FOREIGN KEY (`id_matricula`) REFERENCES `matricula` (`id_matricula`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of presenca
-- ----------------------------
INSERT INTO `presenca` VALUES (4, 7, '2025-11-20', 1);
INSERT INTO `presenca` VALUES (5, 8, '2025-11-19', 1);
INSERT INTO `presenca` VALUES (6, 8, '2025-11-20', 1);

-- ----------------------------
-- Table structure for turma
-- ----------------------------
DROP TABLE IF EXISTS `turma`;
CREATE TABLE `turma`  (
  `id_turma` int NOT NULL AUTO_INCREMENT,
  `id_docente` int NOT NULL,
  `ano` year NOT NULL,
  `semestre` int NOT NULL,
  `codigo_turma` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `criado_em` datetime NULL DEFAULT current_timestamp(),
  `id_curso` int NOT NULL,
  PRIMARY KEY (`id_turma`) USING BTREE,
  UNIQUE INDEX `codigo_turma`(`codigo_turma` ASC) USING BTREE,
  INDEX `id_docente`(`id_docente` ASC) USING BTREE,
  INDEX `id_curso`(`id_curso` ASC) USING BTREE,
  CONSTRAINT `turma_ibfk_1` FOREIGN KEY (`id_docente`) REFERENCES `docente` (`id_docente`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `turma_ibfk_2` FOREIGN KEY (`id_curso`) REFERENCES `curso` (`id_curso`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of turma
-- ----------------------------
INSERT INTO `turma` VALUES (8, 1, 2028, 1, 'INF101-T01', '2025-11-19 14:14:27', 2);
INSERT INTO `turma` VALUES (9, 1, 2025, 1, 'PSY201-T01', '2025-11-19 14:14:27', 2);
INSERT INTO `turma` VALUES (10, 1, 2025, 2, 'PSY202-T01', '2025-11-19 14:14:27', 2);
INSERT INTO `turma` VALUES (11, 1, 2025, 1, 'INF102-T01', '2025-11-19 14:14:27', 1);
INSERT INTO `turma` VALUES (12, 1, 2025, 1, 'TESTE-T01', '2025-11-19 14:56:41', 1);
INSERT INTO `turma` VALUES (13, 12, 2029, 1, 'INF92-T05', '2025-11-19 15:03:02', 1);
INSERT INTO `turma` VALUES (14, 12, 2023, 2, 'INF102-T07', '2025-11-19 16:07:51', 2);

SET FOREIGN_KEY_CHECKS = 1;
