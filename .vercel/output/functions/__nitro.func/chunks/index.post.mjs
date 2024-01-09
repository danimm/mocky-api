import { d as defineEventHandler, c as createError } from './nitro/vercel.mjs';
import { u as useDB, A as AvailableMockData } from './availableMockData.mjs';
import { collection, Timestamp } from 'firebase/firestore';
import { writeBatch, doc } from '@firebase/firestore';
import 'node:http';
import 'node:https';
import 'fs';
import 'path';
import '@firebase/app';

const downloadsMockData = [
  {
    "title": "Beispiel Turnusabrechnung Energie 360",
    "category": "Merkbl\xE4tter",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Turnusabrechnung-Beispiel-energie360.pdf",
    "file_name": "Turnusabrechnung-Beispiel-energie360.pdf",
    "format": "PDF (111.7\xA0KB)"
  },
  {
    "title": "Bericht der Eidgen\xF6ssischen Materialspr\xFCfungs- und Forschungsanstalt (EMPA)",
    "category": "Berichte",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Studie-Empa-Oekobilanz-BiogasZH2021-energie360.pdf",
    "file_name": "Studie-Empa-Oekobilanz-BiogasZH2021-energie360.pdf",
    "format": "PDF (1.4\xA0MB)"
  },
  {
    "title": "Code of Conduct Energie 360\xB0",
    "category": "Bedingungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Code-of-Conduct-EN-energie360.pdf",
    "file_name": "Code-of-Conduct-EN-energie360.pdf",
    "format": "PDF (1.2\xA0MB)"
  },
  {
    "title": "Code of Conduct for Suppliers of Energie 360\xB0",
    "category": "Bedingungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/CodeofConductforSuppliers-2021-EN-energie360.pdf",
    "file_name": "CodeofConductforSuppliers-2021-EN-energie360.pdf",
    "format": "PDF (667.7\xA0KB)"
  },
  {
    "title": "Communiqu\xE9 de presse 100% d\u2019\xE9nergie renouvelable d\u2019ici 2040",
    "category": "Medienmitteilungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/2022-03-Communique-de-presse-exercice2021_energie360.pdf",
    "file_name": "2022-03-Communique-de-presse-exercice2021_energie360.pdf",
    "format": "PDF (119.9\xA0KB)"
  },
  {
    "title": "Communiqu\xE9 de presse Energie 360\xB0 augmente syst\xE9matiquement la part d\u2019\xE9nergie renouvelable",
    "category": "Medienmitteilungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/2023-03-Communique-de-presse-exercice2022_energie360.pdf",
    "file_name": "2023-03-Communique-de-presse-exercice2022_energie360.pdf",
    "format": "PDF (116.9\xA0KB)"
  },
  {
    "title": "Communiqu\xE9 de presse Energie 360\xB0 inaugure le r\xE9seau d\u2019\xE9nergie durable EnerLac",
    "category": "Medienmitteilungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/2023-04-communique_de_presse-EnerLac-energie360.pdf",
    "file_name": "2023-04-communique_de_presse-EnerLac-energie360.pdf",
    "format": "PDF (147.0\xA0KB)"
  },
  {
    "title": "Communiqu\xE9 de presse Energie\u202F360\xB0 prend une participation dans Solarmotion",
    "category": "Medienmitteilungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/2023.07.18._Communiqu%C3%A9_de_presse_Energie360_prend_une_participation_dans_Solarmotion.pdf",
    "file_name": "2023.07.18._Communiqu\xE9_de_presse_Energie360_prend_une_participation_dans_Solarmotion.pdf",
    "format": "PDF (112.9\xA0KB)"
  },
  {
    "title": "Communiqu\xE9 de Presse Swisscharge et Protoscar fusionnent",
    "category": "Medienmitteilungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/2023-03-Communique-de-presse-Swisscharge-energie360.pdf",
    "file_name": "2023-03-Communique-de-presse-Swisscharge-energie360.pdf",
    "format": "PDF (112.4\xA0KB)"
  },
  {
    "title": "Einbauanleitung Gas-Hauseinf\xFChrungskombination HEK",
    "category": "Leitungsbau",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Einbauanleitung_Hauseinfuhrungskombination_energie360.pdf",
    "file_name": "Einbauanleitung_Hauseinfuhrungskombination_energie360.pdf",
    "format": "PDF (204.4\xA0KB)"
  },
  {
    "title": "Einbauanleitung Strassenkappen Novo",
    "category": "Leitungsbau",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Einbauanleitung_Strassenkappen_Novo_mit_Bildern_energie360.pdf",
    "file_name": "Einbauanleitung_Strassenkappen_Novo_mit_Bildern_energie360.pdf",
    "format": "PDF (239.3\xA0KB)"
  },
  {
    "title": "Einverst\xE4ndniserkl\xE4rung Energieverbrauchsdaten",
    "category": "Merkbl\xE4tter",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Einverstandniserklarung_Energieverbrauchsdaten.pdf",
    "file_name": "Einverstandniserklarung_Energieverbrauchsdaten.pdf",
    "format": "PDF (858.6\xA0KB)"
  },
  {
    "title": "Faktenblatt Bioenergie Frauenfeld",
    "category": "Medienmitteilungen",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/2021-01-Faktenblatt-Bioenergie-Frauenfeld-energie360.pdf",
    "file_name": "2021-01-Faktenblatt-Bioenergie-Frauenfeld-energie360.pdf",
    "format": "PDF (412.4\xA0KB)"
  },
  {
    "title": "Finanzbericht 2020",
    "category": "Berichte",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Finanzbericht-2020-Energie360.pdf",
    "file_name": "Finanzbericht-2020-Energie360.pdf",
    "format": "PDF (1.3\xA0MB)"
  },
  {
    "title": "Finanzbericht 2021",
    "category": "Berichte",
    "download_url": "https://energie-360-services-stage.drei.io/media/downloads/Finanzbericht-2021-Energie360.pdf",
    "file_name": "Finanzbericht-2021-Energie360.pdf",
    "format": "PDF (3.0\xA0MB)"
  }
];

const index_post = defineEventHandler(async (event) => {
  const { db } = useDB();
  const { Downloads } = AvailableMockData;
  try {
    const batch = writeBatch(db);
    for (const download of downloadsMockData) {
      await new Promise((resolve) => {
        setTimeout(() => {
          batch.set(doc(collection(db, Downloads)), { ...download, "created_at": Timestamp.now() });
          resolve("");
        }, 1e3);
      });
    }
    await batch.commit();
    return { statusCode: 200 };
  } catch (error) {
    return createError({
      message: error.message,
      statusCode: 500
    });
  }
});

export { index_post as default };
//# sourceMappingURL=index.post.mjs.map
