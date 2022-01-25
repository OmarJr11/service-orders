\c postgres

select pg_terminate_backend(pid) from pg_stat_activity WHERE datname='service_orders';

DROP DATABASE if exists service_orders;
CREATE DATABASE service_orders
WITH ENCODING = "UTF8"
CONNECTION LIMIT = -1;

\c service_orders

\encoding UTF8

CREATE SCHEMA system;

CREATE DOMAIN dec_nonnegative   DECIMAL(18,4) CHECK(VALUE >= 0.0000);

CREATE TABLE system.users (
    id                  BIGSERIAL       NOT NULL,

    first_name          VARCHAR(50)     NOT NULL,
    last_name           VARCHAR(50)     NOT NULL,
    password            VARCHAR(100)    NULL,
    email               VARCHAR(100)    NOT NULL,
    status              VARCHAR(50)     NOT NULL,
    telephone           VARCHAR(50)     NULL,
    services            TEXT[]          NULL,

    creator             BIGINT          NULL,
    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modifier            BIGINT          NULL,
    modification_date   TIMESTAMP       NULL,

    last_login          TIMESTAMP       NULL,

    PRIMARY KEY (id),
    FOREIGN KEY (creator)   REFERENCES system.users(id),
    FOREIGN KEY (modifier)  REFERENCES system.users(id)
);

CREATE UNIQUE INDEX users_email_uq ON system.users USING btree(lower(email)) WHERE status <> 'Deleted';

CREATE TABLE system.roles (
    id                  SERIAL		    NOT NULL,

    name     			VARCHAR(50)	    NOT NULL,
	status				VARCHAR(50)	    NOT NULL,

    creator             BIGINT          NOT NULL,
    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modifier            BIGINT          NULL,
    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY (id),
	UNIQUE(name),
    FOREIGN KEY (creator)   REFERENCES system.users(id),
    FOREIGN KEY (modifier)  REFERENCES system.users(id)
);

CREATE TABLE system.user_roles (
    id      BIGSERIAL   NOT NULL,

    "user"  BIGINT 	    NOT NULL,
	"role"  INT 	    NOT NULL,
	status  VARCHAR(50) NOT NULL,

    creator             BIGINT          NOT NULL,
    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modifier            BIGINT          NULL,
    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY(id),
    UNIQUE ("user", "role"),
    FOREIGN KEY (role)      REFERENCES system.roles(id),
    FOREIGN KEY ("user")    REFERENCES system.users(id),
    FOREIGN KEY (creator)   REFERENCES system.users(id),
    FOREIGN KEY (modifier)  REFERENCES system.users(id)
);

CREATE TABLE system.refresh_tokens(
    "user"              BIGINT          NOT NULL,
    token               VARCHAR(400)    NOT NULL,
    refresh             VARCHAR(400)    NOT NULL,
    expire              TIMESTAMP       NOT NULL,

    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("user", token),
    FOREIGN KEY ("user") REFERENCES system.users(id)
);

CREATE TABLE service (
    id              BIGSERIAL       NOT NULL,
    
    name            VARCHAR(50)     NOT NULL,
    price           dec_nonnegative NOT NULL, 
    status          VARCHAR(50)     NOT NULL,

    creator             BIGINT          NOT NULL,
    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modifier            BIGINT          NULL,
    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY (id),
    UNIQUE (name),
    FOREIGN KEY (creator)   REFERENCES  system.users(id),
    FOREIGN KEY (modifier)  REFERENCES  system.users(id)
);

CREATE UNIQUE INDEX service_uq_idx ON service USING btree(lower(name)) WHERE status <> 'Deleted';


CREATE TABLE tickets (
    id                  BIGSERIAL       NOT NULL,

    service             BIGSERIAL       NOT NULL,
    token               VARCHAR(100)    NOT NULL,
    status              VARCHAR(50)     NOT NULL,

    creator             BIGINT          NOT NULL,
    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modifier            BIGINT          NULL,
    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY(id),
    FOREIGN KEY (service)               REFERENCES service(id),
    FOREIGN KEY (creator)               REFERENCES  system.users(id),
    FOREIGN KEY (modifier)              REFERENCES  system.users(id)
);

CREATE TABLE service_request (
    id                  BIGSERIAL       NOT NULL,
    
    technical           BIGSERIAL       NOT NULL,
    ticket              BIGSERIAL       NOT NULL,
    status              VARCHAR(50)     NOT NULL,

    creator             BIGINT          NOT NULL,
    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modifier            BIGINT          NULL,
    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY(id),
    FOREIGN KEY (ticket)                REFERENCES  tickets(id),
    FOREIGN KEY (technical)             REFERENCES  system.users(id),
    FOREIGN KEY (creator)               REFERENCES  system.users(id),
    FOREIGN KEY (modifier)              REFERENCES  system.users(id)
);

INSERT INTO system.users (  id, first_name, last_name, password, email, status, telephone, creation_date) 
values(0, 'admin', 'admin', '', 'admin@delivery.com', 'Active', '', CURRENT_TIMESTAMP);

SELECT pg_catalog.setval('system.users_id_seq', 1, FALSE);

INSERT INTO system.roles (id, name, status, creator) 
values  (1, 'User', 'Active', 0),
        (2, 'Admin', 'Active', 0),
        (3, 'Technical', 'Active', 0);

SELECT pg_catalog.setval('system.roles_id_seq', 4, FALSE);

INSERT INTO service ( id, name, price, status, creator, creation_date) 
values  (0, 'Maintenance', 50, 'Active', 0, CURRENT_TIMESTAMP),
        (1, 'Support', 60, 'Active', 0, CURRENT_TIMESTAMP),
        (2, 'Installation', 70, 'Active', 0, CURRENT_TIMESTAMP),
        (3, 'Repair', 80, 'Active', 0, CURRENT_TIMESTAMP);

SELECT pg_catalog.setval('service_id_seq', 4, FALSE);