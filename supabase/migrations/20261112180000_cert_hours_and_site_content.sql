-- Horas en certificaciones + fila única de copy del sitio (editable desde /admin).

alter table public.certifications
  add column if not exists hours text;

create table if not exists public.site_content (
  id smallint primary key default 1 check (id = 1),
  hero_eyebrow text,
  hero_body text,
  hero_body_secondary text,
  about_title text,
  about_description text,
  about_paragraphs jsonb not null default '[]'::jsonb,
  work_description text,
  contact_description text,
  experience jsonb not null default '[]'::jsonb,
  education jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.site_content (id)
values (1)
on conflict (id) do nothing;

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

drop policy if exists site_content_select on public.site_content;
drop policy if exists site_content_insert on public.site_content;
drop policy if exists site_content_update on public.site_content;
drop policy if exists site_content_delete on public.site_content;

create policy site_content_select on public.site_content
  for select to anon, authenticated
  using (true);

create policy site_content_insert on public.site_content
  for insert to authenticated
  with check (public.is_admin());

create policy site_content_update on public.site_content
  for update to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy site_content_delete on public.site_content
  for delete to authenticated
  using (public.is_admin());
