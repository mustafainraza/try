const query = `
-- Table: public.Investor

-- DROP TABLE IF EXISTS public."Investor";

CREATE TABLE IF NOT EXISTS public."Investor"
(
    "Investor_id" bigint NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 9223372036854775807 CACHE 1 ),
    "Investor_name" text COLLATE pg_catalog."default" NOT NULL,
    "Investor_email" text COLLATE pg_catalog."default" NOT NULL,
    "Investor_password" text COLLATE pg_catalog."default" NOT NULL,
    "Investor_CNIC" text COLLATE pg_catalog."default" NOT NULL,
    "Investor_Contact" text COLLATE pg_catalog."default" NOT NULL,
    "Token" text COLLATE pg_catalog."default",
    "Investor_Image" bytea,
    CONSTRAINT "Investor_pkey" PRIMARY KEY ("Investor_id")
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public."Investor"
    OWNER to postgres;
`;
module.exports.query;
