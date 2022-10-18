--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-05-30 10:54:09

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 209 (class 1259 OID 24684)
-- Name: admins; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admins (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    password character varying(255)
);


ALTER TABLE public.admins OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 24689)
-- Name: admins_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admins_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.admins_id_seq OWNER TO postgres;

--
-- TOC entry 3357 (class 0 OID 0)
-- Dependencies: 210
-- Name: admins_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admins_id_seq OWNED BY public.admins.id;


--
-- TOC entry 211 (class 1259 OID 24690)
-- Name: events; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.events (
    id integer NOT NULL,
    name character varying(255),
    held timestamp without time zone,
    image1 character varying(255),
    image2 character varying(255),
    image3 character varying(255),
    image4 character varying(255),
    logo character varying(255),
    isactive boolean DEFAULT false,
    capacity integer
);


ALTER TABLE public.events OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 24696)
-- Name: events_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.events_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.events_id_seq OWNER TO postgres;

--
-- TOC entry 3358 (class 0 OID 0)
-- Dependencies: 212
-- Name: events_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.events_id_seq OWNED BY public.events.id;


--
-- TOC entry 213 (class 1259 OID 24697)
-- Name: participants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.participants (
    id integer NOT NULL,
    name character varying(255),
    email character varying(255),
    password character varying(255),
    referral_code character varying(255),
    used_by integer,
    referrer character varying(255)
);


ALTER TABLE public.participants OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 24702)
-- Name: participants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.participants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.participants_id_seq OWNER TO postgres;

--
-- TOC entry 3359 (class 0 OID 0)
-- Dependencies: 214
-- Name: participants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.participants_id_seq OWNED BY public.participants.id;


--
-- TOC entry 215 (class 1259 OID 24703)
-- Name: referral_levels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.referral_levels (
    id integer DEFAULT nextval('public.participants_id_seq'::regclass) NOT NULL,
    level integer,
    range character varying(255)
);


ALTER TABLE public.referral_levels OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 24707)
-- Name: tickets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    participant integer,
    event integer,
    time_order timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tickets OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 24711)
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tickets_id_seq OWNER TO postgres;

--
-- TOC entry 3360 (class 0 OID 0)
-- Dependencies: 217
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- TOC entry 3183 (class 2604 OID 24712)
-- Name: admins id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins ALTER COLUMN id SET DEFAULT nextval('public.admins_id_seq'::regclass);


--
-- TOC entry 3185 (class 2604 OID 24713)
-- Name: events id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events ALTER COLUMN id SET DEFAULT nextval('public.events_id_seq'::regclass);


--
-- TOC entry 3186 (class 2604 OID 24714)
-- Name: participants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants ALTER COLUMN id SET DEFAULT nextval('public.participants_id_seq'::regclass);


--
-- TOC entry 3189 (class 2604 OID 24715)
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- TOC entry 3343 (class 0 OID 24684)
-- Dependencies: 209
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.admins (id, name, email, password) VALUES (4, 'Super Admin', 'admin@bisnis.com', '$2b$10$oiq9eF6KhP3gMSgdvmfXDudArcKdtymEZ7YizDLrjwT3.o0VKzKEi');


--
-- TOC entry 3345 (class 0 OID 24690)
-- Dependencies: 211
-- Data for Name: events; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.events (id, name, held, image1, image2, image3, image4, logo, isactive, capacity) VALUES (18, 'Talkshow Bisnis', '2022-05-29 00:00:00', 'bfa3f2f284fb47cf89d80a4472c90941.png', '0bfb1fbdd48449bbb1a1ca630a1ee799.png', '42aec1f127854d9e809d1bb6699dae2c.png', '82e8f89eb7124b8993b28ed61541ecb1.png', NULL, false, 100);
INSERT INTO public.events (id, name, held, image1, image2, image3, image4, logo, isactive, capacity) VALUES (17, 'Seminar Kesehatan', '2022-05-28 00:00:00', NULL, NULL, NULL, NULL, NULL, true, 75);


--
-- TOC entry 3347 (class 0 OID 24697)
-- Dependencies: 213
-- Data for Name: participants; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (57, 'Participant', 'a.iqbal@gmail.com', '$2b$10$S2OUf3iN.7pSjPa3FkKZTedRTWwDBPWGVTODH6wb/31zmcAXYFPti', '40ef310850ab43e', NULL, '1baefb620aa7407');
INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (58, 'Participant', 'b.iqbal@gmail.com', '$2b$10$4opSyTVL.wKPr171XQcb6.v7KkBuqXKupHRwXT0DTYdIXvvP3wm4S', '6401f901b760476', NULL, '1baefb620aa7407');
INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (59, 'Participant', 'c.iqbal@gmail.com', '$2b$10$X3atieULgCSJyQeiHRWRd.fceE0CuIcKJ2/NUYT4gGGqVWijsiq.i', '1171b906c5be409', NULL, '1baefb620aa7407');
INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (61, 'Participant', 'a.alhuda@gmail.com', '$2b$10$92mvnOUhmaQae.YMQ.AtBOdadYgHiXQC2j4/0qMsfY8.xYy5nwT.e', '25b9c7da9bb3489', NULL, 'a8bdaa5b397b431');
INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (56, 'Participant', 'iqbal@gmail.com', '$2b$10$iQ62wOdxZvIDBwZTxqLrYOoEyFF7TqCXjP.yFZPxSOvj0cKe6crLS', '1baefb620aa7407', 4, '');
INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (62, 'Participant', 'd.iqbal@gmail.com', '$2b$10$xNOQAuqfW8O3hQyElRgBAOYRFDhViTeXVVOdB.Nf21LvFh6Rtz59a', '663ab7c9c61b4e1', NULL, '1baefb620aa7407');
INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (60, 'Participant', 'alhuda@gmail.com', '$2b$10$4W2JW/onfbG3Xh054jzuleDICcG0xA5TW/l1grAEvOmydbK5D5IBy', 'a8bdaa5b397b431', 2, '');
INSERT INTO public.participants (id, name, email, password, referral_code, used_by, referrer) VALUES (63, 'Participant', 'b.alhuda@gmail.com', '$2b$10$vBHZbioWD4TSV1VyGyIkvee8yjfK.uqofTH32L2FzgOhfwMx6J3SG', '4ef5ce05331148a', NULL, 'a8bdaa5b397b431');


--
-- TOC entry 3349 (class 0 OID 24703)
-- Dependencies: 215
-- Data for Name: referral_levels; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.referral_levels (id, level, range) VALUES (40, 2, '4-6');
INSERT INTO public.referral_levels (id, level, range) VALUES (41, 3, '7-9');
INSERT INTO public.referral_levels (id, level, range) VALUES (39, 1, '1-3');


--
-- TOC entry 3350 (class 0 OID 24707)
-- Dependencies: 216
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tickets (id, participant, event, time_order) VALUES (24, 56, 17, '2022-05-24 08:24:42.844322');
INSERT INTO public.tickets (id, participant, event, time_order) VALUES (25, 57, 17, '2022-05-24 08:27:08.912755');
INSERT INTO public.tickets (id, participant, event, time_order) VALUES (26, 58, 17, '2022-05-24 08:28:05.40351');
INSERT INTO public.tickets (id, participant, event, time_order) VALUES (27, 59, 17, '2022-05-24 09:35:54.040997');
INSERT INTO public.tickets (id, participant, event, time_order) VALUES (28, 60, 18, '2022-05-24 10:22:42.754252');
INSERT INTO public.tickets (id, participant, event, time_order) VALUES (29, 61, 18, '2022-05-24 15:47:58.753506');
INSERT INTO public.tickets (id, participant, event, time_order) VALUES (30, 62, 17, '2022-05-25 08:58:55.702884');
INSERT INTO public.tickets (id, participant, event, time_order) VALUES (31, 63, 18, '2022-05-25 11:32:20.476236');


--
-- TOC entry 3361 (class 0 OID 0)
-- Dependencies: 210
-- Name: admins_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admins_id_seq', 6, true);


--
-- TOC entry 3362 (class 0 OID 0)
-- Dependencies: 212
-- Name: events_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.events_id_seq', 18, true);


--
-- TOC entry 3363 (class 0 OID 0)
-- Dependencies: 214
-- Name: participants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.participants_id_seq', 63, true);


--
-- TOC entry 3364 (class 0 OID 0)
-- Dependencies: 217
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tickets_id_seq', 31, true);


--
-- TOC entry 3191 (class 2606 OID 24717)
-- Name: admins admins_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_email_key UNIQUE (email);


--
-- TOC entry 3193 (class 2606 OID 24719)
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admins
    ADD CONSTRAINT admins_pkey PRIMARY KEY (id);


--
-- TOC entry 3195 (class 2606 OID 24721)
-- Name: events events_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.events
    ADD CONSTRAINT events_pkey PRIMARY KEY (id);


--
-- TOC entry 3197 (class 2606 OID 24723)
-- Name: participants participants_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_email_key UNIQUE (email);


--
-- TOC entry 3199 (class 2606 OID 24725)
-- Name: participants participants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.participants
    ADD CONSTRAINT participants_pkey PRIMARY KEY (id);


--
-- TOC entry 3201 (class 2606 OID 24727)
-- Name: referral_levels referral_levels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.referral_levels
    ADD CONSTRAINT referral_levels_pkey PRIMARY KEY (id);


--
-- TOC entry 3203 (class 2606 OID 24729)
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


-- Completed on 2022-05-30 10:54:10

--
-- PostgreSQL database dump complete
--

