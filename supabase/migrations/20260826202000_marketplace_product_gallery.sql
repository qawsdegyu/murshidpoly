alter table public.marketplace_products
  add column if not exists image_urls text[] not null default '{}'::text[];

update public.marketplace_products
set image_urls = case
  when image_url is not null and trim(image_url) <> '' then array[image_url]
  else '{}'::text[]
end
where image_urls = '{}'::text[];

comment on column public.marketplace_products.image_urls is 'Ordered public image URLs for the product gallery; image_url remains the cover-image compatibility field.';
