use comercial ;

SELECT 'localizacao'     AS tabela, COUNT(*) AS total FROM localizacao
UNION ALL
SELECT 'cliente',                   COUNT(*)          FROM cliente
UNION ALL
SELECT 'satisfacao',                COUNT(*)          FROM satisfacao
UNION ALL
SELECT 'categoria',                 COUNT(*)          FROM categoria
UNION ALL
SELECT 'tipo_pagamento',            COUNT(*)          FROM tipo_pagamento
UNION ALL
SELECT 'vendedor',                  COUNT(*)          FROM vendedor
UNION ALL
SELECT 'produto',                   COUNT(*)          FROM produto
UNION ALL
SELECT 'registro',                  COUNT(*)          FROM registro;

-- ============================================================
-- 2. CONTEÚDO DAS TABELAS DE APOIO
-- ============================================================

SELECT * FROM localizacao ORDER BY id_localizacao;
SELECT * FROM cliente ORDER BY id_cliente;
SELECT * FROM satisfacao ORDER BY id_satisfacao;
SELECT * FROM categoria ORDER BY id_categoria;
SELECT * FROM tipo_pagamento ORDER BY id_tipo_pagamento;
SELECT * FROM vendedor ORDER BY id_vendedor;

-- ============================================================
-- 3. AMOSTRA DE PRODUTOS (primeiros 10)
-- ============================================================
SELECT
    p.id_produto,
    p.nome_produto,
    p.valor_unitario,
    c.nome_categoria
FROM produto p
JOIN categoria c ON p.fk_id_categoria = c.id_categoria
ORDER BY p.id_produto
LIMIT 10;

-- ============================================================
-- 4. VISÃO COMPLETA DOS REGISTROS (JOIN em todas as tabelas)
-- ============================================================
SELECT
    r.id_registro,
    r.data_pedido,
    r.numero_pedido,
    cl.nome_cliente,
    l.cidade,
    l.estado,
    v.nome_vendedor,
    p.nome_produto,
    cat.nome_categoria,
    r.quantidade,
    p.valor_unitario,
    r.valor_total,
    s.nota_satisfacao,
    s.comentario_satisfacao,
    tp.nome_tipo          AS forma_pagamento,
    r.observacao
FROM registro r
JOIN cliente         cl  ON r.fk_id_cliente        = cl.id_cliente
JOIN localizacao     l   ON cl.fk_id_localizacao   = l.id_localizacao
JOIN vendedor        v   ON r.fk_id_vendedor        = v.id_vendedor
JOIN produto         p   ON r.fk_id_produto         = p.id_produto
JOIN categoria       cat ON p.fk_id_categoria       = cat.id_categoria
JOIN satisfacao      s   ON r.fk_id_satisfacao      = s.id_satisfacao
JOIN tipo_pagamento  tp  ON r.fk_id_tipo_pagamento  = tp.id_tipo_pagamento
ORDER BY r.id_registro;

-- ============================================================
-- 5. VERIFICAÇÕES DE INTEGRIDADE
-- ============================================================

-- 5a. Registros com valor_total inconsistente (deve retornar 0)
SELECT COUNT(*) AS inconsistencias_valor_total
FROM registro r
JOIN produto p ON r.fk_id_produto = p.id_produto
WHERE ABS(r.valor_total - (p.valor_unitario * r.quantidade)) > 0.01;

-- 5b. Registros com numero_pedido duplicado (deve retornar 0)
SELECT numero_pedido, COUNT(*) AS qtd
FROM registro
GROUP BY numero_pedido
HAVING COUNT(*) > 1;

-- 5c. Registros com FK inválida (deve retornar 0 em cada)
SELECT COUNT(*) AS fk_cliente_invalida    FROM registro r LEFT JOIN cliente        c  ON r.fk_id_cliente       = c.id_cliente       WHERE c.id_cliente       IS NULL;
SELECT COUNT(*) AS fk_vendedor_invalida   FROM registro r LEFT JOIN vendedor        v  ON r.fk_id_vendedor      = v.id_vendedor      WHERE v.id_vendedor      IS NULL;
SELECT COUNT(*) AS fk_produto_invalida    FROM registro r LEFT JOIN produto          p  ON r.fk_id_produto       = p.id_produto       WHERE p.id_produto       IS NULL;
SELECT COUNT(*) AS fk_satisfacao_invalida FROM registro r LEFT JOIN satisfacao       s  ON r.fk_id_satisfacao    = s.id_satisfacao    WHERE s.id_satisfacao    IS NULL;
SELECT COUNT(*) AS fk_pagamento_invalida  FROM registro r LEFT JOIN tipo_pagamento  tp  ON r.fk_id_tipo_pagamento= tp.id_tipo_pagamento WHERE tp.id_tipo_pagamento IS NULL;

-- ============================================================
-- 6. RESUMOS ANALÍTICOS
-- ============================================================

-- 6a. Total de vendas por cliente
SELECT
    cl.nome_cliente,
    l.cidade,
    COUNT(r.id_registro)      AS total_pedidos,
    SUM(r.quantidade)         AS total_itens,
    SUM(r.valor_total)        AS receita_total,
    ROUND(AVG(r.valor_total), 2) AS ticket_medio
FROM registro r
JOIN cliente     cl ON r.fk_id_cliente      = cl.id_cliente
JOIN localizacao l  ON cl.fk_id_localizacao = l.id_localizacao
GROUP BY cl.id_cliente, cl.nome_cliente, l.cidade
ORDER BY receita_total DESC;

-- 6b. Total de vendas por produto
SELECT
    p.nome_produto,
    cat.nome_categoria,
    COUNT(r.id_registro)   AS total_pedidos,
    SUM(r.quantidade)      AS total_itens,
    SUM(r.valor_total)     AS receita_total
FROM registro r
JOIN produto   p   ON r.fk_id_produto     = p.id_produto
JOIN categoria cat ON p.fk_id_categoria   = cat.id_categoria
GROUP BY p.nome_produto, cat.nome_categoria
ORDER BY receita_total DESC;

-- 6c. Distribuição por forma de pagamento
SELECT
    tp.nome_tipo          AS forma_pagamento,
    COUNT(r.id_registro)  AS total_pedidos,
    SUM(r.valor_total)    AS receita_total,
    ROUND(COUNT(r.id_registro) * 100.0 / (SELECT COUNT(*) FROM registro), 2) AS pct_pedidos
FROM registro r
JOIN tipo_pagamento tp ON r.fk_id_tipo_pagamento = tp.id_tipo_pagamento
GROUP BY tp.nome_tipo
ORDER BY total_pedidos DESC;

-- 6d. Distribuição por satisfação
SELECT
    s.nota_satisfacao,
    s.comentario_satisfacao,
    COUNT(r.id_registro)  AS total_pedidos,
    ROUND(COUNT(r.id_registro) * 100.0 / (SELECT COUNT(*) FROM registro), 2) AS pct_pedidos
FROM registro r
JOIN satisfacao s ON r.fk_id_satisfacao = s.id_satisfacao
GROUP BY s.nota_satisfacao, s.comentario_satisfacao
ORDER BY s.nota_satisfacao;

-- 6e. Receita por cidade
SELECT
    l.cidade,
    l.estado,
    COUNT(r.id_registro)  AS total_pedidos,
    SUM(r.valor_total)    AS receita_total
FROM registro r
JOIN cliente     cl ON r.fk_id_cliente      = cl.id_cliente
JOIN localizacao l  ON cl.fk_id_localizacao = l.id_localizacao
GROUP BY l.cidade, l.estado
ORDER BY receita_total DESC;

-- 6f. Receita por mês
SELECT
    DATE_FORMAT(r.data_pedido, '%Y-%m') AS mes,
    COUNT(r.id_registro)                AS total_pedidos,
    SUM(r.valor_total)                  AS receita_total
FROM registro r
GROUP BY DATE_FORMAT(r.data_pedido, '%Y-%m')
ORDER BY mes;