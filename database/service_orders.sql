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
    email               VARCHAR(100)    NOT NULL,
    status              VARCHAR(50)     NOT NULL,
    telephone           VARCHAR(50)     NULL,
    type                VARCHAR(20)     NOT NULL,
    services            TEXT[]          NOT NULL,

    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY (id)
);

CREATE UNIQUE INDEX users_email_uq ON system.users USING btree(lower(email)) WHERE status <> 'Deleted';
CREATE UNIQUE INDEX users_telephone_uq ON system.users USING btree(lower(telephone)) WHERE status <> 'Deleted';

CREATE TABLE service (
    id              BIGSERIAL       NOT NULL,
    
    name            VARCHAR(50)     NOT NULL,
    status          VARCHAR(50)     NOT NULL,

    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY (id),
    UNIQUE (name)
);

CREATE UNIQUE INDEX service_uq_idx ON service USING btree(lower(name)) WHERE status <> 'Deleted';

CREATE TABLE service_request (
    id              BIGSERIAL       NOT NULL,
    
    id_user         BIGSERIAL       NOT NULL,
    id_service      BIGSERIAL       NOT NULL,
    price           dec_nonnegative NOT NULL, 
    status          VARCHAR(50)     NOT NULL,

    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY(id),
    FOREIGN KEY (id_user)           REFERENCES system.users(id),
    FOREIGN KEY (id_service)        REFERENCES service(id)
);

CREATE TABLE ticket (
    id              BIGSERIAL       NOT NULL,
    
    id_technical    BIGSERIAL       NOT NULL,
    id_request      BIGSERIAL       NOT NULL,
    price           dec_nonnegative NOT NULL, 
    status          VARCHAR(50)     NOT NULL,

    creation_date       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,

    modification_date   TIMESTAMP       NULL,

    PRIMARY KEY(id),
    FOREIGN KEY (id_technical)       REFERENCES system.users(id),
    FOREIGN KEY (id_request)        REFERENCES service_request(id)
);

INSERT INTO service ( id, name, status, creation_date) 
values  (0, 'Maintenance', 'Active', CURRENT_TIMESTAMP),
        (1, 'Support', 'Active', CURRENT_TIMESTAMP),
        (2, 'Installation', 'Active', CURRENT_TIMESTAMP),
        (3, 'Repair', 'Active', CURRENT_TIMESTAMP);

SELECT pg_catalog.setval('service_id_seq', 4, FALSE);