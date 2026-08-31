from pathlib import Path
import re

ai = Path('/home/ubuntu/murshidpoly/src/services/ai-integration.ts')
s = ai.read_text()
s = s.replace('model: OPENROUTER_MODEL,\n        temperature: 0,\n        response_format:', 'model: "google/gemini-2.0-flash-001",\n        temperature: 0,\n        response_format:')
# Gemini vision is more tolerant when JSON is requested in the prompt instead of strict schema mode.
s = re.sub(r'\n        response_format: \{\n          type: "json_schema",[\s\S]*?\n        \},\n        messages:', '\n        messages:', s, count=1)
ai.write_text(s)

component = Path('/home/ubuntu/murshidpoly/src/components/ExamStudyPlanner.tsx')
s = component.read_text()
old = '''    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = String(reader.result || "");'''
new = '''    const reader = new FileReader();
    reader.onload = async () => {
      const sourceUrl = String(reader.result || "");
      const dataUrl = await new Promise<string>((resolve) => {
        const image = new Image();
        image.onload = () => {
          const maxSide = 1800;
          const scale = Math.min(1, maxSide / Math.max(image.naturalWidth, image.naturalHeight));
          const canvas = document.createElement("canvas");
          canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
          canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
          const context = canvas.getContext("2d");
          context?.drawImage(image, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL("image/jpeg", 0.88));
        };
        image.onerror = () => resolve(sourceUrl);
        image.src = sourceUrl;
      });'''
if old not in s:
    raise SystemExit('component anchor not found')
component.write_text(s.replace(old, new, 1))
print('patched')
