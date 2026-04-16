-- Préférence « avec qui manger » — inclusion / découverte, pas fil dating.
alter table public.profiles
  add column if not exists meal_with_preference text not null default 'tout_le_monde'
    check (
      meal_with_preference in ('tout_le_monde', 'profils_similaires', 'decouvrir_styles')
    );

comment on column public.profiles.meal_with_preference is
  'Avec qui l’utilisateur préfère partager la table : tout le monde, profils proches en style, ou styles différents.';
