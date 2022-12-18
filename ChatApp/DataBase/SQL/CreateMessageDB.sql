CREATE SEQUENCE IF NOT EXISTS public."Messages_Id_seq";
CREATE TABLE IF NOT EXISTS public."Messages"
(
    "Id" integer NOT NULL DEFAULT nextval('"Messages_Id_seq"'::regclass),
    "User" text COLLATE pg_catalog."default" NOT NULL,
    "MessageText" text COLLATE pg_catalog."default" NOT NULL,
    "MessageDate" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Messages" PRIMARY KEY ("Id")
);

ALTER TABLE IF EXISTS public."Messages"
    OWNER to postgres;

CREATE SEQUENCE IF NOT EXISTS public."Messages_Id_seq"
    INCREMENT 1
    START 1
    MINVALUE 1
    MAXVALUE 2147483647
    CACHE 1
    OWNED BY "Messages"."Id";

ALTER SEQUENCE public."Messages_Id_seq"
    OWNER TO postgres;

insert into "Messages" ("Id", "User", "MessageText", "MessageDate")
values (1,'Salavat','hi','2022-12-31');