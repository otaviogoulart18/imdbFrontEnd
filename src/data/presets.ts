import { MovieFormData } from '../types/prediction';

export interface MoviePreset {
  id: string;
  name: string;
  originalTitle: string;
  tagline: string;
  expectedClass: 'top' | 'common';
  data: MovieFormData;
}

export const MOVIE_PRESETS: MoviePreset[] = [
  {
    id: 'shawshank',
    name: 'Um Sonho de Liberdade',
    originalTitle: 'The Shawshank Redemption (1994)',
    tagline: 'O filme #1 de todos os tempos do IMDb Top 250',
    expectedClass: 'top',
    data: {
      title: 'The Shawshank Redemption',
      year: 1994,
      runtime: 142,
      metascore: 80,
      votes: 2343110,
    },
  },
  {
    id: 'dark-knight',
    name: 'O Cavaleiro das Trevas',
    originalTitle: 'The Dark Knight (2008)',
    tagline: 'Obra-prima de Christopher Nolan',
    expectedClass: 'top',
    data: {
      title: 'The Dark Knight',
      year: 2008,
      runtime: 152,
      metascore: 84,
      votes: 2720000,
    },
  },
  {
    id: 'pulp-fiction',
    name: 'Pulp Fiction',
    originalTitle: 'Pulp Fiction (1994)',
    tagline: 'Clássico cult de Quentin Tarantino com 95 no Metascore',
    expectedClass: 'top',
    data: {
      title: 'Pulp Fiction',
      year: 1994,
      runtime: 154,
      metascore: 95,
      votes: 2110000,
    },
  },
  {
    id: 'interstellar',
    name: 'Interestelar',
    originalTitle: 'Interstellar (2014)',
    tagline: 'Ficção científica aclamada pelo público com alta duração',
    expectedClass: 'top',
    data: {
      title: 'Interstellar',
      year: 2014,
      runtime: 169,
      metascore: 74,
      votes: 1910000,
    },
  },
  {
    id: 'generic-romcom',
    name: 'Comédia Comercial Típica',
    originalTitle: 'Typical Rom-Com (2019)',
    tagline: 'Crítica mista e engajamento modesto de público',
    expectedClass: 'common',
    data: {
      title: 'Comédia Comercial Típica',
      year: 2019,
      runtime: 93,
      metascore: 44,
      votes: 38500,
    },
  },
  {
    id: 'action-b',
    name: 'Ação Descartável B',
    originalTitle: 'Standard Action Thriller (2022)',
    tagline: 'Lançamento direto para streaming com avaliação média',
    expectedClass: 'common',
    data: {
      title: 'Ação Descartável B',
      year: 2022,
      runtime: 104,
      metascore: 49,
      votes: 72000,
    },
  },
];
