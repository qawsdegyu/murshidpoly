import fs from 'fs';
import path from 'path';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const pdf = require('pdf-parse');
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables in .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const DATA_DIR = './data';
const OLLAMA_ENDPOINT = 'http://localhost:11434/api/embeddings';
const EMBEDDING_MODEL = 'nomic-embed-text';
const CHUNK_SIZE = 1000;

function chunkText(text: string, size: number): string[] {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.substring(i, i + size));
  }
  return chunks;
}

async function getEmbedding(text: string): Promise<number[]> {
  try {
    const response = await fetch(OLLAMA_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: EMBEDDING_MODEL,
        prompt: text,
      }),
    });

    const data = await response.json();
    return data.embedding;
  } catch (error) {
    console.error("Error getting embedding from Ollama:", error);
    throw error;
  }
}

async function processFiles() {
  console.log(`🚀 Starting Ingestion from ${DATA_DIR}...`);

  if (!fs.existsSync(DATA_DIR)) {
    console.error(`Directory ${DATA_DIR} does not exist.`);
    return;
  }

  const files = fs.readdirSync(DATA_DIR).filter(f => 
    f.endsWith('.pdf') || f.endsWith('.md') || f.endsWith('.txt')
  );
  console.log(`Found ${files.length} files.`);

  for (const file of files) {
    const filePath = path.join(DATA_DIR, file);
    console.log(`\n📄 Processing: ${file}`);

    try {
      let text = "";
      if (file.endsWith('.pdf')) {
        const dataBuffer = fs.readFileSync(filePath);
        const data = await pdf(dataBuffer);
        text = data.text;
      } else {
        text = fs.readFileSync(filePath, 'utf8');
      }

      console.log(`   - Text extracted (${text.length} characters)`);
      let chunks: string[] = [];
      if (file.endsWith('.md')) {
        // Split by main headers to keep semesters separate
        chunks = text.split(/\n(?=## )/g).map(c => c.trim()).filter(c => c.length > 0);
      } else {
        chunks = chunkText(text, CHUNK_SIZE);
      }
      console.log(`   - Split into ${chunks.length} chunks`);

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        process.stdout.write(`   - Chunking & Embedding ${i + 1}/${chunks.length}...\r`);
        
        const embedding = await getEmbedding(chunk);

        const { error } = await supabase
          .from('documents')
          .insert({
            content: chunk,
            metadata: {
              source: file,
              chunk_index: i,
              total_chunks: chunks.length
            },
            embedding: embedding
          });

        if (error) {
          console.error(`\n❌ Error inserting chunk ${i} of ${file}:`, error.message);
        }
      }
      console.log(`\n✅ Finished: ${file}`);
    } catch (err) {
      console.error(`\n❌ Failed to process ${file}:`, err);
    }
  }

  console.log("\n✨ All done!");
}

processFiles();
