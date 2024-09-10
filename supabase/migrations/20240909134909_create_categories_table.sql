CREATE TABLE
  public.category (
    id UUID NOT NULL DEFAULT gen_random_uuid (),
    NAME TEXT NOT NULL,
    gender_category_id BIGINT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT category_pkey PRIMARY KEY (id),
    CONSTRAINT gender_category_fkey FOREIGN KEY (gender_category_id) REFERENCES gender_categories (id)
  ) TABLESPACE pg_default;