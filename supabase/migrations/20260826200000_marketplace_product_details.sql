alter table public.marketplace_products
  add column if not exists benefit_ar text,
  add column if not exists benefit_en text,
  add column if not exists link_url text,
  add column if not exists link_label_ar text,
  add column if not exists link_label_en text;

comment on column public.marketplace_products.benefit_ar is 'What the student gets or learns from the product, in Arabic.';
comment on column public.marketplace_products.link_url is 'Optional external product/resource link shown as a clickable CTA.';
comment on column public.marketplace_products.link_label_ar is 'Arabic label for the external product/resource link.';
