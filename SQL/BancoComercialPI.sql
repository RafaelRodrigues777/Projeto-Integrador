	create database comercial;
	use comercial;

	create table localizacao(
	id_localizacao int not null primary key auto_increment,
	cidade varchar(50) not null,
	estado varchar(2) not null
	);

	create table cliente(
	id_cliente int not null primary key auto_increment,
	nome_cliente varchar(50) not null,
	fk_id_localizacao int not null,

	constraint fk_id_localizacao
	foreign key(fk_id_localizacao)
	references localizacao(id_localizacao)
	on delete restrict
	on update restrict
	);

	create table satisfacao(
	id_satisfacao int not null primary key auto_increment,
	nota_satisfacao int not null,
	comentario_satisfacao varchar(25) not null
	);

	create table categoria(
	id_categoria int not null primary key auto_increment,
	nome_categoria varchar(50) not null
	);

	create table tipo_pagamento(
	id_tipo_pagamento int not null primary key auto_increment,
	nome_tipo varchar(50) not null
	);

	create table produto(
	id_produto int not null primary key auto_increment,
	nome_produto varchar(50) not null,
	valor_unitario decimal(10,2) not null,
	fk_id_categoria int not null,


	constraint fk_id_categoria
	foreign key(fk_id_categoria)
	references categoria(id_categoria)
	on delete restrict
	on update restrict
	);

	create table vendedor(
	id_vendedor int not null primary key auto_increment,
	nome_vendedor varchar(50)
	);

	create table registro(
	id_registro int not null primary key auto_increment,
	data_pedido date not null,
	numero_pedido varchar(15) not null,
	fk_id_cliente int not null,
	fk_id_vendedor int not null,
	fk_id_produto int not null,
	quantidade int not null,
	valor_total decimal(10,2) not null,
	fk_id_satisfacao int not null,
	fk_id_tipo_pagamento int not null,
	observacao varchar(100),

	constraint fk_id_cliente
	foreign key(fk_id_cliente)
	references cliente(id_cliente)
	on delete restrict
	on update restrict,

	constraint fk_id_vendedor
	foreign key (fk_id_vendedor)
	references vendedor(id_vendedor)
	on delete restrict
	on update restrict,

	constraint fk_id_produto
	foreign key(fk_id_produto)
	references produto(id_produto)
	on delete restrict
	on update restrict,

	constraint fk_id_satisfacao
	foreign key(fk_id_satisfacao)
	references satisfacao(id_satisfacao)
	on delete restrict
	on update restrict,

	constraint fk_id_tipo_pagamento
	foreign key (fk_id_tipo_pagamento)
	references tipo_pagamento(id_tipo_pagamento)
	on delete restrict
	on update restrict
	);

	alter table registro
	modify numero_pedido varchar(15) not null;

	delimiter $$
	create trigger trg_numero_pedido
	before insert on registro
	for each row
	begin
		declare prox_id int;
		declare v_valor_unitario decimal(10,2);
		
		select ifnull(max(id_registro),0) + 1
		into prox_id
		from registro;
		
		set new.numero_pedido = concat('PED-',lpad(prox_id, 3, '0'));
		
		select valor_unitario
		into v_valor_unitario
		from produto
		where id_produto = new.fk_id_produto;
		
		set new.valor_total = v_valor_unitario * new.quantidade;
	end$$

	delimiter ;


