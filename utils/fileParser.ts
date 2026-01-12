import * as XLSX from 'xlsx';
import * as pdfjsLib from 'pdfjs-dist';
import { AppData, InventoryItem, KnowledgeBaseItem } from '../types';

// Set worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@3.11.174/build/pdf.worker.min.js';

export const parseUploadedFile = async (file: File): Promise<AppData> => {
  return new Promise(async (resolve, reject) => {
    const fileExt = file.name.split('.').pop()?.toLowerCase();

    try {
      if (fileExt === 'json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const json = JSON.parse(e.target?.result as string);
            resolve({
              inventory: json.inventory || [],
              knowledgeBase: json.knowledgeBase || []
            });
          } catch (err) {
            reject(new Error("Invalid JSON file"));
          }
        };
        reader.readAsText(file);
      } else if (fileExt === 'xlsx' || fileExt === 'xls') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = new Uint8Array(e.target?.result as ArrayBuffer);
            const workbook = XLSX.read(data, { type: 'array' });
            
            let inventory: InventoryItem[] = [];
            let knowledgeBase: KnowledgeBaseItem[] = [];

            workbook.SheetNames.forEach(sheetName => {
              const lowerName = sheetName.toLowerCase();
              const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);

              if (lowerName.includes('inventory')) {
                inventory = sheetData as InventoryItem[];
              } else if (lowerName.includes('knowledge') || lowerName.includes('kb')) {
                knowledgeBase = sheetData as KnowledgeBaseItem[];
              }
            });

            if (inventory.length === 0 && workbook.SheetNames.length > 0) {
              inventory = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]) as InventoryItem[];
            }
            if (knowledgeBase.length === 0 && workbook.SheetNames.length > 1) {
              knowledgeBase = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]) as KnowledgeBaseItem[];
            }

            resolve({ inventory, knowledgeBase });
          } catch (err) {
            reject(err);
          }
        };
        reader.readAsArrayBuffer(file);
      } else if (fileExt === 'pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        
        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items.map((item: any) => item.str).join(' ');
          fullText += `\n--- Page ${i} ---\n${pageText}`;
        }

        resolve({
          inventory: [],
          knowledgeBase: [],
          rawText: fullText
        });
      } else {
        reject(new Error("Unsupported file type. Please upload .json, .xlsx, or .pdf"));
      }
    } catch (error) {
      reject(error);
    }
  });
};