--
-- PostgreSQL database cluster dump
--

\restrict sHiafOhUFw4wfhRVVNj67TdlqmCGKgIerZx8s4zD2gq6lnUeOfgeoAXKPR5vl2O

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Drop databases (except postgres and template1)
--

DROP DATABASE IF EXISTS blog;




--
-- Drop roles
--

DROP ROLE IF EXISTS blog;


--
-- Roles
--

CREATE ROLE blog;
ALTER ROLE blog WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:yvnfqpCK5GBSXOccV2n/0w==$dvzVRG/3JqiK0ihKcKZ8rGuHMJGO7XOGLrRwYefHHDE=:z62VuuqPLawKV7VZl8oY5iwsDkSPhkinXs7ZBaFAF1Y=';

--
-- User Configurations
--








\unrestrict sHiafOhUFw4wfhRVVNj67TdlqmCGKgIerZx8s4zD2gq6lnUeOfgeoAXKPR5vl2O

--
-- Databases
--

--
-- Database "template1" dump
--

--
-- PostgreSQL database dump
--

\restrict ByhSWu246LUrq4I6Mlhv7lpoHvX4B3KEkGxWqO7WcCFHta3SuYtBcsn09HiJx82

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

UPDATE pg_catalog.pg_database SET datistemplate = false WHERE datname = 'template1';
DROP DATABASE template1;
--
-- Name: template1; Type: DATABASE; Schema: -; Owner: blog
--

CREATE DATABASE template1 WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE template1 OWNER TO blog;

\unrestrict ByhSWu246LUrq4I6Mlhv7lpoHvX4B3KEkGxWqO7WcCFHta3SuYtBcsn09HiJx82
\connect template1
\restrict ByhSWu246LUrq4I6Mlhv7lpoHvX4B3KEkGxWqO7WcCFHta3SuYtBcsn09HiJx82

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: COMMENT; Schema: -; Owner: blog
--

COMMENT ON DATABASE template1 IS 'default template for new databases';


--
-- Name: template1; Type: DATABASE PROPERTIES; Schema: -; Owner: blog
--

ALTER DATABASE template1 IS_TEMPLATE = true;


\unrestrict ByhSWu246LUrq4I6Mlhv7lpoHvX4B3KEkGxWqO7WcCFHta3SuYtBcsn09HiJx82
\connect template1
\restrict ByhSWu246LUrq4I6Mlhv7lpoHvX4B3KEkGxWqO7WcCFHta3SuYtBcsn09HiJx82

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE template1; Type: ACL; Schema: -; Owner: blog
--

REVOKE CONNECT,TEMPORARY ON DATABASE template1 FROM PUBLIC;
GRANT CONNECT ON DATABASE template1 TO PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict ByhSWu246LUrq4I6Mlhv7lpoHvX4B3KEkGxWqO7WcCFHta3SuYtBcsn09HiJx82

--
-- Database "blog" dump
--

--
-- PostgreSQL database dump
--

\restrict XyF8xrUoGiOVV4TApBrkJIFuWESc7DtMFP0cyaHRHKXZRUroC7R4gUTPGGd9CW4

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: blog; Type: DATABASE; Schema: -; Owner: blog
--

CREATE DATABASE blog WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE blog OWNER TO blog;

\unrestrict XyF8xrUoGiOVV4TApBrkJIFuWESc7DtMFP0cyaHRHKXZRUroC7R4gUTPGGd9CW4
\connect blog
\restrict XyF8xrUoGiOVV4TApBrkJIFuWESc7DtMFP0cyaHRHKXZRUroC7R4gUTPGGd9CW4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: blog
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO blog;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: blog
--

COMMENT ON SCHEMA public IS '';


--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: blog
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'USER'
);


ALTER TYPE public."UserRole" OWNER TO blog;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Comment; Type: TABLE; Schema: public; Owner: blog
--

CREATE TABLE public."Comment" (
    id integer NOT NULL,
    "postId" integer NOT NULL,
    "parentId" integer,
    "authorName" text NOT NULL,
    "authorEmail" text,
    content text NOT NULL,
    "isApproved" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Comment" OWNER TO blog;

--
-- Name: Comment_id_seq; Type: SEQUENCE; Schema: public; Owner: blog
--

CREATE SEQUENCE public."Comment_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Comment_id_seq" OWNER TO blog;

--
-- Name: Comment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blog
--

ALTER SEQUENCE public."Comment_id_seq" OWNED BY public."Comment".id;


--
-- Name: Post; Type: TABLE; Schema: public; Owner: blog
--

CREATE TABLE public."Post" (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    content text NOT NULL,
    published boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Post" OWNER TO blog;

--
-- Name: Post_id_seq; Type: SEQUENCE; Schema: public; Owner: blog
--

CREATE SEQUENCE public."Post_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Post_id_seq" OWNER TO blog;

--
-- Name: Post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blog
--

ALTER SEQUENCE public."Post_id_seq" OWNED BY public."Post".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: blog
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public."User" OWNER TO blog;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: blog
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_id_seq" OWNER TO blog;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: blog
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: blog
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO blog;

--
-- Name: Comment id; Type: DEFAULT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."Comment" ALTER COLUMN id SET DEFAULT nextval('public."Comment_id_seq"'::regclass);


--
-- Name: Post id; Type: DEFAULT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."Post" ALTER COLUMN id SET DEFAULT nextval('public."Post_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Comment; Type: TABLE DATA; Schema: public; Owner: blog
--

COPY public."Comment" (id, "postId", "parentId", "authorName", "authorEmail", content, "isApproved", "createdAt", "updatedAt") FROM stdin;
1	1	\N	Имя автора	new@example.com	Мой комментарий 3	f	2025-12-08 15:45:12.61	2025-12-08 15:45:12.61
\.


--
-- Data for Name: Post; Type: TABLE DATA; Schema: public; Owner: blog
--

COPY public."Post" (id, title, slug, content, published, "createdAt", "updatedAt") FROM stdin;
1	Заголовок	post	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:40:03.682	2025-12-08 15:40:03.682
2	Заголовок2	2	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:33.783	2025-12-08 15:41:33.783
3	Заголовок3	3	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:36.524	2025-12-08 15:41:36.524
4	Заголовок4	4	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:38.502	2025-12-08 15:41:38.502
5	Заголовок5	5	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:40.126	2025-12-08 15:41:40.126
6	Заголовок6	6	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:42.535	2025-12-08 15:41:42.535
7	Заголовок7	7	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:44.172	2025-12-08 15:41:44.172
8	Заголовок8	8	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:45.581	2025-12-08 15:41:45.581
9	Заголовок9	9	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:48.156	2025-12-08 15:41:48.156
10	Заголовок10	10	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:50.702	2025-12-08 15:41:50.702
11	Заголовок11	11	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:52.855	2025-12-08 15:41:52.855
12	Заголовок12	12	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:56.276	2025-12-08 15:41:56.276
13	Заголовок13	13	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:41:58.95	2025-12-08 15:41:58.95
14	Заголовок14	14	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 15:42:01.069	2025-12-08 15:42:01.069
15	Добро пожаловать в блог	post-1	Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad adipisci animi at, debitis dicta earum error eveniet ex expedita illum inventore, molestiae nostrum, quaerat qui recusandae repellendus similique vel veniam.	t	2025-12-08 16:48:09.191	2025-12-08 16:48:09.191
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: blog
--

COPY public."User" (id, email, "passwordHash", role, "createdAt", "updatedAt") FROM stdin;
1	admin@example.com	$2b$10$ZKe7VX4zf1k6m0TAsYAWP.DnGtRQVrEk/SJKN/QWjXsLYHOA/5Qvi	ADMIN	2025-12-08 15:31:20.743	2025-12-08 15:31:20.743
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: blog
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
e1e551c0-eb23-40f6-814a-ca5326e7bfd6	4ab51e6e0b97d4abd811e227410a218dd26b57e719028e013b8af1a5d01e16b6	2025-12-08 15:31:14.87945+00	20251208150420_init	\N	\N	2025-12-08 15:31:14.828772+00	1
\.


--
-- Name: Comment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blog
--

SELECT pg_catalog.setval('public."Comment_id_seq"', 2, true);


--
-- Name: Post_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blog
--

SELECT pg_catalog.setval('public."Post_id_seq"', 15, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: blog
--

SELECT pg_catalog.setval('public."User_id_seq"', 1, true);


--
-- Name: Comment Comment_pkey; Type: CONSTRAINT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_pkey" PRIMARY KEY (id);


--
-- Name: Post Post_pkey; Type: CONSTRAINT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."Post"
    ADD CONSTRAINT "Post_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: Post_slug_key; Type: INDEX; Schema: public; Owner: blog
--

CREATE UNIQUE INDEX "Post_slug_key" ON public."Post" USING btree (slug);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: blog
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Comment Comment_parentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES public."Comment"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: Comment Comment_postId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: blog
--

ALTER TABLE ONLY public."Comment"
    ADD CONSTRAINT "Comment_postId_fkey" FOREIGN KEY ("postId") REFERENCES public."Post"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: blog
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict XyF8xrUoGiOVV4TApBrkJIFuWESc7DtMFP0cyaHRHKXZRUroC7R4gUTPGGd9CW4

--
-- Database "postgres" dump
--

--
-- PostgreSQL database dump
--

\restrict N28bdW5ZdZ0T2bMKrhEbQjP9PfdWPdUW1JawFO55UqkWIvyXr5u49g1PSC476Nd

-- Dumped from database version 16.11 (Debian 16.11-1.pgdg13+1)
-- Dumped by pg_dump version 16.11 (Debian 16.11-1.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE postgres;
--
-- Name: postgres; Type: DATABASE; Schema: -; Owner: blog
--

CREATE DATABASE postgres WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE postgres OWNER TO blog;

\unrestrict N28bdW5ZdZ0T2bMKrhEbQjP9PfdWPdUW1JawFO55UqkWIvyXr5u49g1PSC476Nd
\connect postgres
\restrict N28bdW5ZdZ0T2bMKrhEbQjP9PfdWPdUW1JawFO55UqkWIvyXr5u49g1PSC476Nd

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: DATABASE postgres; Type: COMMENT; Schema: -; Owner: blog
--

COMMENT ON DATABASE postgres IS 'default administrative connection database';


--
-- PostgreSQL database dump complete
--

\unrestrict N28bdW5ZdZ0T2bMKrhEbQjP9PfdWPdUW1JawFO55UqkWIvyXr5u49g1PSC476Nd

--
-- PostgreSQL database cluster dump complete
--

