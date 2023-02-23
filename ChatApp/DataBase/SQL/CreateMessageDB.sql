create table if not exists "__EFMigrationsHistory"
(
    "MigrationId"    varchar(150) not null
    constraint "PK___EFMigrationsHistory"
    primary key,
    "ProductVersion" varchar(32)  not null
    );

alter table "__EFMigrationsHistory"
    owner to postgres;

create table if not exists "Chats"
(
    "Id"           uuid    not null
    constraint "PK_Chats"
    primary key,
    "ClientId"     text    not null,
    "AdminId"      text,
    "IsProcessing" boolean not null
);

alter table "Chats"
    owner to postgres;

create table if not exists "Messages"
(
    "Id"          uuid    not null
    constraint "PK_Messages"
    primary key,
    "Username"    text    not null,
    "MessageData" text    not null,
    "MessageType" integer not null,
    "ChatId"      uuid    not null
    constraint "FK_Messages_Chats_ChatId"
    references "Chats"
    on delete cascade
);

alter table "Messages"
    owner to postgres;

create index if not exists "IX_Messages_ChatId"
    on "Messages" ("ChatId");

