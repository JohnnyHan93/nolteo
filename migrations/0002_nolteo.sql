create table if not exists yard_clicks (
  item_id text primary key,
  day_count integer not null default 0,
  week_count integer not null default 0,
  month_count integer not null default 0,
  all_count integer not null default 0,
  day_stamp text not null default '',
  week_stamp text not null default '',
  month_stamp text not null default ''
);

create table if not exists yard_posts (
  id text primary key,
  nick text not null,
  tag text not null,
  title text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists yard_comments (
  id text primary key,
  post_id text not null,
  nick text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists yard_comments_post_idx on yard_comments (post_id);

create table if not exists yard_reviews (
  id text primary key,
  item_id text not null,
  nick text not null,
  score integer not null,
  body text not null,
  created_at timestamptz not null default now()
);

create index if not exists yard_reviews_item_idx on yard_reviews (item_id);

create table if not exists yard_extras (
  id text primary key,
  title text not null,
  href text not null,
  blurb text not null,
  github text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists yard_prompts (
  id text primary key,
  nick text not null,
  title text not null,
  model text not null,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists yard_tips (
  id text primary key,
  nick text not null,
  title text not null,
  body text not null,
  github text not null default '',
  created_at timestamptz not null default now()
);

insert into yard_clicks (
  item_id, day_count, week_count, month_count, all_count, day_stamp, week_stamp, month_stamp
)
select
  v.item_id,
  v.day_count,
  v.week_count,
  v.month_count,
  v.all_count,
  to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM-DD'),
  to_char(now() at time zone 'Asia/Seoul', 'IYYY-IW'),
  to_char(now() at time zone 'Asia/Seoul', 'YYYY-MM')
from (
  values
    ('react-test'::text, 842::int, 5104::int, 16820::int, 40211::int),
    ('doodle', 611, 3902, 12044, 28810),
    ('minute', 390, 2104, 7440, 15102),
    ('calc', 274, 1688, 5901, 13340),
    ('psych-play', 508, 2860, 8440, 15110),
    ('pick', 266, 1490, 4102, 8020),
    ('neal', 1204, 8044, 24110, 88021),
    ('craft', 640, 3900, 11200, 24010),
    ('quickdraw', 966, 6220, 19880, 64012),
    ('2048', 1102, 7440, 22104, 91044),
    ('little', 733, 4510, 15002, 42018),
    ('radio', 588, 3660, 11990, 30551),
    ('monkey', 804, 5122, 17004, 45590),
    ('excal', 455, 2880, 9901, 24012),
    ('photopea', 512, 3401, 11220, 28990),
    ('openpsych', 690, 4211, 13660, 35220),
    ('human', 477, 2994, 10110, 26604),
    ('patatap', 266, 1540, 4880, 14022),
    ('useless', 701, 4330, 12880, 39014),
    ('window', 318, 1902, 6400, 17110),
    ('coolors', 241, 1508, 4990, 13220),
    ('desmos', 188, 1211, 4088, 11904),
    ('agar', 955, 6402, 20110, 77040),
    ('skribbl', 640, 4102, 13330, 36018),
    ('cookie', 512, 3550, 12140, 48022),
    ('slow', 344, 2108, 6404, 12880),
    ('wordle', 610, 4010, 11020, 22640),
    ('regex', 166, 990, 3440, 9804),
    ('prompts-hall', 430, 2501, 8012, 16640)
) as v(item_id, day_count, week_count, month_count, all_count)
on conflict (item_id) do nothing;
