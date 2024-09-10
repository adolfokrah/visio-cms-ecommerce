CREATE TABLE
  public.products (
    id BIGINT GENERATED ALWAYS AS IDENTITY NOT NULL,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    available_colors jsonb NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    photos jsonb NOT NULL,
    category_id UUID NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT products_pkey PRIMARY KEY (id),
    CONSTRAINT products_category_fkey FOREIGN KEY (category_id) REFERENCES category (id)
  ) TABLESPACE pg_default;