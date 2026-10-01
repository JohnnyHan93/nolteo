alter table yard_extras add column if not exists category text not null default 'made';
alter table yard_extras add column if not exists nick text not null default '익명';
