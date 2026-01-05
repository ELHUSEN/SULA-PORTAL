import { SectionData, SheetRow, Dataset } from '../types';

const SHEET_ID = '1tSWh1Gbpu4NZFu-IKSVfyOMZ2_dIwzdP7pJlAjtOaz4';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv`;

// Robust CSV Parser to handle quoted strings containing commas
const parseCSV = (text: string): string[][] => {
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++; // Skip next quote
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n' || char === '\r') {
        if (currentField || currentRow.length > 0) {
          currentRow.push(currentField.trim());
        }
        if (currentRow.length > 0) {
            rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
        if (char === '\r' && nextChar === '\n') i++; // Handle CRLF
      } else {
        currentField += char;
      }
    }
  }
  // Flush last field/row
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    rows.push(currentRow);
  }
  
  return rows;
};

const normalizeSectionType = (type: string): SectionData['type'] => {
  const t = type.toLowerCase().trim();
  if (t.includes('hero')) return 'hero';
  if (t.includes('feature') || t.includes('service')) return 'features';
  if (t.includes('price') || t.includes('pricing')) return 'pricing';
  if (t.includes('testimonial') || t.includes('review')) return 'testimonials';
  if (t.includes('cta') || t.includes('call')) return 'cta';
  if (t.includes('header') || t.includes('nav')) return 'header';
  if (t.includes('footer')) return 'footer';
  return 'unknown';
};

export const fetchSheetData = async (): Promise<{ sections: SectionData[], datasets: Dataset[], rawText: string }> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const csvText = await response.text();
    const rows = parseCSV(csvText);

    if (rows.length < 2) {
      throw new Error("Sheet appears empty or invalid format.");
    }

    // Assume first row is header. map headers to indices
    const headers = rows[0].map(h => h.toLowerCase());
    
    // Check if this is the "Dataset" schema or the "Landing Page" schema
    const isDatasetSchema = headers.some(h => h.includes('produsen') || h.includes('name data') || h.includes('frekuensi'));

    let sections: SectionData[] = [];
    let datasets: Dataset[] = [];
    let rawText = '';

    if (isDatasetSchema) {
        // Map for Dataset Schema
        const idx = {
            pic: headers.findIndex(h => h.includes('pic')),
            name: headers.findIndex(h => h.includes('name') || h.includes('nama') || h.includes('judul')),
            code: headers.findIndex(h => h.includes('kode data')),
            producer: headers.findIndex(h => h.includes('produsen')),
            nature: headers.findIndex(h => h.includes('sifat')),
            frequency: headers.findIndex(h => h.includes('frekuensi')),
            inputDate: headers.findIndex(h => h.includes('tgl input')),
            updateDate: headers.findIndex(h => h.includes('tgl diperbaharui')),
            activity: headers.findIndex(h => h.includes('kegiatan')),
            concept: headers.findIndex(h => h.includes('konsep')),
            classification: headers.findIndex(h => h.includes('klasifikasi')),
            size: headers.findIndex(h => h.includes('ukuran')),
            unit: headers.findIndex(h => h.includes('satuan')),
            definition: headers.findIndex(h => h.includes('defenisi') || h.includes('definisi')),
            description: headers.findIndex(h => h.includes('keterangan')),
            sector: headers.findIndex(h => h.includes('sektoral')),
            image: headers.findIndex(h => h.includes('image') || h.includes('gambar')),
            refCode: headers.findIndex(h => h.includes('kode referensi')),
            accessStatus: headers.findIndex(h => h.includes('status') || h.includes('akses')),
            badge: headers.findIndex(h => h.includes('badge')),
            link: headers.findIndex(h => h.includes('link') || h.includes('view') || h.includes('embed')),
        };

        datasets = rows.slice(1).map(row => {
            const get = (i: number) => (i !== -1 && row[i] ? row[i] : '');
            return {
                pic: get(idx.pic),
                name: get(idx.name),
                code: get(idx.code),
                producer: get(idx.producer),
                nature: get(idx.nature),
                frequency: get(idx.frequency),
                inputDate: get(idx.inputDate),
                updateDate: get(idx.updateDate),
                activity: get(idx.activity),
                concept: get(idx.concept),
                classification: get(idx.classification),
                size: get(idx.size),
                unit: get(idx.unit),
                definition: get(idx.definition),
                description: get(idx.description),
                sector: get(idx.sector),
                image: get(idx.image),
                refCode: get(idx.refCode),
                accessStatus: get(idx.accessStatus),
                badge: get(idx.badge),
                link: get(idx.link),
            };
        }).filter(d => d.name); // Filter rows without name

        rawText = datasets.map(d => 
            `Dataset: ${d.name}\nProdusen: ${d.producer}\nDeskripsi: ${d.definition}\nStatus: ${d.accessStatus}\n`
        ).join('\n---\n');

    } else {
        // Helper to find index roughly for Landing Page Schema
        const findIdx = (keywords: string[]) => headers.findIndex(h => keywords.some(k => h.includes(k)));

        const idxMap = {
            section: findIdx(['section', 'type', 'category']),
            title: findIdx(['title', 'heading', 'name']),
            subtitle: findIdx(['subtitle', 'description', 'body', 'text']),
            image: findIdx(['image', 'img', 'url', 'photo']),
            ctaText: findIdx(['button', 'cta label', 'action']),
            ctaLink: findIdx(['link', 'href', 'url']),
            extra: findIdx(['price', 'extra', 'meta', 'tag'])
        };

        // Fallback if headers fail (generic column order assumption: Type, Title, Subtitle, Image, CTA Text, CTA Link, Extra)
        if (idxMap.section === -1) {
            idxMap.section = 0;
            idxMap.title = 1;
            idxMap.subtitle = 2;
            idxMap.image = 3;
            idxMap.ctaText = 4;
            idxMap.ctaLink = 5;
            idxMap.extra = 6;
        }

        sections = rows.slice(1).map((row, index) => {
            const getVal = (idx: number) => (idx !== -1 && row[idx]) ? row[idx] : '';
            const typeStr = getVal(idxMap.section);
            return {
                id: `section-${index}`,
                type: normalizeSectionType(typeStr),
                content: {
                section: typeStr,
                title: getVal(idxMap.title),
                subtitle: getVal(idxMap.subtitle),
                image: getVal(idxMap.image),
                ctaText: getVal(idxMap.ctaText),
                ctaLink: getVal(idxMap.ctaLink),
                extra: getVal(idxMap.extra)
                }
            };
        }).filter(s => s.content.section);

        rawText = sections.map(s => 
            `Section: ${s.content.section}\nTitle: ${s.content.title}\nContent: ${s.content.subtitle}\nDetails: ${s.content.extra}\n`
        ).join('\n---\n');
    }

    return { sections, datasets, rawText };

  } catch (error) {
    console.error("Sheet fetch error:", error);
    throw error;
  }
};