PGDMP         .        	    	    v           SoccerStats !   10.5 (Ubuntu 10.5-0ubuntu0.18.04) !   10.5 (Ubuntu 10.5-0ubuntu0.18.04)     p           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                       false            q           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                       false            r           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                       false            s           1262    16385    SoccerStats    DATABASE        CREATE DATABASE "SoccerStats" WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'en_US.UTF-8' LC_CTYPE = 'en_US.UTF-8';
    DROP DATABASE "SoccerStats";
             postgres    false                        2615    2200    public    SCHEMA        CREATE SCHEMA public;
    DROP SCHEMA public;
             postgres    false            t           0    0    SCHEMA public    COMMENT     6   COMMENT ON SCHEMA public IS 'standard public schema';
                  postgres    false    3                        3079    13039    plpgsql 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;
    DROP EXTENSION plpgsql;
                  false            u           0    0    EXTENSION plpgsql    COMMENT     @   COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';
                       false    1            �            1259    16388    players    TABLE     /  CREATE TABLE public.players (
    playerid integer NOT NULL,
    dob date NOT NULL,
    "position" character varying(50) NOT NULL,
    fname character varying(75) NOT NULL,
    lname character varying(75) NOT NULL,
    goals integer NOT NULL,
    assists integer NOT NULL,
    saves integer NOT NULL
);
    DROP TABLE public.players;
       public         zach    false    3            �            1259    16386    players_playerid_seq    SEQUENCE     �   CREATE SEQUENCE public.players_playerid_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public.players_playerid_seq;
       public       zach    false    3    197            v           0    0    players_playerid_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public.players_playerid_seq OWNED BY public.players.playerid;
            public       zach    false    196            �            1259    24578    users    TABLE     $  CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(255) NOT NULL,
    email character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
    DROP TABLE public.users;
       public         zach    false    3            �            1259    24576    users_id_seq    SEQUENCE     �   CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 #   DROP SEQUENCE public.users_id_seq;
       public       zach    false    199    3            w           0    0    users_id_seq    SEQUENCE OWNED BY     =   ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
            public       zach    false    198            �
           2604    16391    players playerid    DEFAULT     t   ALTER TABLE ONLY public.players ALTER COLUMN playerid SET DEFAULT nextval('public.players_playerid_seq'::regclass);
 ?   ALTER TABLE public.players ALTER COLUMN playerid DROP DEFAULT;
       public       zach    false    197    196    197            �
           2604    24581    users id    DEFAULT     d   ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
 7   ALTER TABLE public.users ALTER COLUMN id DROP DEFAULT;
       public       zach    false    199    198    199            k          0    16388    players 
   TABLE DATA               a   COPY public.players (playerid, dob, "position", fname, lname, goals, assists, saves) FROM stdin;
    public       zach    false    197   G       m          0    24578    users 
   TABLE DATA               X   COPY public.users (id, username, email, password, "createdAt", "updatedAt") FROM stdin;
    public       zach    false    199   �       x           0    0    players_playerid_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public.players_playerid_seq', 47, true);
            public       zach    false    196            y           0    0    users_id_seq    SEQUENCE SET     :   SELECT pg_catalog.setval('public.users_id_seq', 9, true);
            public       zach    false    198            �
           2606    16393    players players_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.players
    ADD CONSTRAINT players_pkey PRIMARY KEY (playerid);
 >   ALTER TABLE ONLY public.players DROP CONSTRAINT players_pkey;
       public         zach    false    197            �
           2606    24590    users users_email_key 
   CONSTRAINT     Q   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);
 ?   ALTER TABLE ONLY public.users DROP CONSTRAINT users_email_key;
       public         zach    false    199            �
           2606    24586    users users_pkey 
   CONSTRAINT     N   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
 :   ALTER TABLE ONLY public.users DROP CONSTRAINT users_pkey;
       public         zach    false    199            �
           2606    24588    users users_username_key 
   CONSTRAINT     W   ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);
 B   ALTER TABLE ONLY public.users DROP CONSTRAINT users_username_key;
       public         zach    false    199            k   �   x�-̱�0�����@͵�Q�0''�F�P[S���GBn�.��ohD��H4ps������D����*@a�U+�Z��h}q%�0�<� m|s�Ӭ�[����>'7��3������	j�k���A*-�L�8���M��ln�p���B��0I      m   3  x�}��n�@F��.�Jg�A��? jmkQ�nƙAF`@P�>}m�&�&]ܛ|�,����B�&�H!EA�ۥD$�R���M�3o�F�Ъ|�ڼ��6�"�^Y���ͫ�'�7��n�K{� ��D
�ӂ�����5|=�R;�#c����I��H�\���#4v��:i�oVc�EkȐ�������aty:����}���n�]r�jZH�����
�"���
.i�0"˳H~�2���ϒ�T>����w��H��8�/Ool<�z:��B�������#�S���/7���-�Հn޸�!�]SU�W�}`     