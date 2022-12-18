create database proj_db;
\connect proj_db

drop table if exists user_info cascade;
drop table if exists profile cascade;
drop table if exists song cascade;
drop table if exists playlist cascade;
drop table if exists playlist_song cascade;
drop table if exists liked_playlist cascade;
drop table if exists premium cascade;
drop table if exists genre cascade;
drop type if exists premium_type cascade;
drop type if exists user_type cascade;
drop type if exists country cascade;
drop type if exists playlist_type cascade;
drop type if exists genre_type cascade;

-- user
create type user_type as enum ('user', 'artist', 'admin');
create table user_info (
                           id int generated always as identity,
                           email varchar(255) not null,
                           password varchar(255) not null,
                           primary key (id)
);

create type country as enum ('russia', 'ukraine', 'usa', 'greece');
create table profile (
                         user_id int unique,
                         username varchar(255),
                         birthday date,
                         country country,
                         profile_img varchar(255),
                         type user_type not null,
                         primary key (user_id),
                         constraint fk_profile
                             foreign key (user_id)
                                 references user_info (id) on delete cascade
);

create type premium_type as enum ('individual', 'student', 'duo', 'family', 'basic');
create table premium (
                         user_id int unique,
                         type premium_type not null,
                         start_at timestamp not null,
                         end_at timestamp not null,
                         primary key (user_id),
                         constraint fk_premium
                             foreign key (user_id)
                                 references user_info (id) on delete cascade
);

-- songs
create table song (
                      id int generated always as identity,
                      user_id int not null,
                      name varchar(250) not null,
                      source varchar(150) not null,
                      primary key (id),
                      constraint fk_song
                          foreign key (user_id)
                              references user_info (id) on delete cascade
);

create type playlist_type as enum ('album', 'single', 'ep', 'user', 'liked_songs');
create table playlist (
                          id int generated always as identity,
                          title varchar (255) not null,
                          user_id int not null,
                          type playlist_type not null,
                          img_src varchar (255),
                          verified bool not null,
                          primary key (id),
                          constraint fk_playlist
                              foreign key (user_id)
                                  references user_info (id) on delete cascade
);

create type genre_type as enum ('rock', 'jazz', 'techno', 'electro', 'country', 'pop');
create table genre (
                       playlist_id int not null,
                       type genre_type not null,
                       constraint fk_genre
                           foreign key (playlist_id)
                               references playlist (id) on delete cascade
);

create table playlist_song (
                               playlist_id int not null,
                               song_id int not null,
                               primary key (playlist_id, song_id),
                               constraint fk_playlist_song_playlist_id
                                   foreign key (playlist_id)
                                       references playlist (id) on delete cascade,
                               constraint fk_playlist_song_song_id
                                   foreign key (song_id)
                                       references song (id) on delete cascade
);

create table liked_playlist (
                                user_id int not null,
                                playlist_id int not null,
                                primary key (user_id, playlist_id),
                                constraint fk_liked_playlist_user_id
                                    foreign key (user_id)
                                        references user_info (id) on delete cascade,
                                constraint fk_liked_playlist_playlist_id
                                    foreign key (playlist_id)
                                        references playlist (id) on delete cascade
);

insert into user_info (email, password)
values ('admin@gmail.com','admin');
insert into profile (user_id, username, birthday, country, profile_img, type)
values (1,'admin','2022-12-14','russia',null,'admin');