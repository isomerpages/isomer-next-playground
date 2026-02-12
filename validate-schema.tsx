#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import Ajv from 'ajv';
import { fileURLToPath } from 'url';

// Get directory path relative to current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SCHEMA_DIR = path.join(__dirname, 'schema');
const BASE_SCHEMA = path.join(__dirname, 'public/0.1.0.json');

// Recursively get all .json files in schema directory
function getJsonFiles(dir: string): string[] {
  const files: string[] = [];
  const items = fs.readdirSync(dir);

  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...getJsonFiles(fullPath));
    } else if (path.extname(item) === '.json' && !item.endsWith('_pages.json')) {
      files.push(fullPath);
    }
  });

  return files;
}

// Validate each schema file against base schema
async function validateSchemas() {
  const ajv = new Ajv({ strict: false, allErrors: false });
  const baseSchema = JSON.parse(fs.readFileSync(BASE_SCHEMA, 'utf8'));
  const validate = ajv.compile(baseSchema);
  const schemaFiles = getJsonFiles(SCHEMA_DIR);
  let hasErrors = false;
  const results: {filename: string, errors: string[]}[] = [];

  for (const file of schemaFiles) {
    try {
      const schema = JSON.parse(fs.readFileSync(file, 'utf8'));
      
      try {
        const valid = validate(schema);
        if (!valid) {
          hasErrors = true;
          results.push({
            filename: file,
            errors: validate.errors?.map(e => {
              // Convert path to more descriptive format
              const path = e.instancePath.split('/').filter(Boolean);
              let description = '';
              
              if (path.length > 0) {
                description = path.join(' > ');
              } else {
                description = 'Root';
              }
              
              return `${description} ${e.message}`;
            }) || ['Unknown validation error']
          });
        } else {
          results.push({filename: file, errors: []});
        }
      } catch (validationError) {
        hasErrors = true;
        results.push({
          filename: file,
          errors: [(validationError instanceof Error) ? validationError.message : 'Unknown validation error']
        });
      }
    } catch (error) {
      hasErrors = true;
      results.push({
        filename: file,
        errors: [(error instanceof Error) ? error.message : 'Unknown error']
      });
    }
  }

  console.log(`\nScanned ${schemaFiles.length} schema files`);
  if (hasErrors) {
    console.log('\nInvalid Schemas:');
    results.forEach(result => {
      if (result.errors.length > 0) {
        console.log(`\n${result.filename}:`);
        console.log('\x1b[31m✗ Invalid\x1b[0m');
        result.errors.forEach(err => console.log(`  - ${err}`));
      }
    });
    const invalidFiles = results.filter(r => r.errors.length > 0).length;
    console.log(`\n${invalidFiles}/${schemaFiles.length} files are invalid`);

    console.log('\nValid Schemas:');
    results.forEach(result => {
      if (result.errors.length === 0) {
        console.log(`\n${result.filename}:`);
        console.log('\x1b[32m✓ Valid\x1b[0m');
      }
    });
  } else {
    console.log('\nAll schemas are valid!');
  }

  const outputFile = 'schema-validation-report.txt';
  const outputContent = results
    .map(result => {
      if (result.errors.length > 0) {
        return `${result.filename}:\n✗ Invalid\n${result.errors.map(err => `  - ${err}`).join('\n')}\n`;
      } else {
        return `${result.filename}:\n✓ Valid\n`;
      }
    })
    .join('\n');
  
  fs.writeFileSync(outputFile, 
    `Schema Validation Results\n` +
    `========================\n` +
    `Scanned ${schemaFiles.length} schema files\n` +
    `${results.filter(r => r.errors.length > 0).length}/${schemaFiles.length} files are invalid\n\n` +
    outputContent
  );
  console.log(`\nValidation results written to ${outputFile}`);
  
  process.exit(hasErrors ? 1 : 0);
}

validateSchemas().catch(error => {
  console.error('Validation failed:', error);
  process.exit(1);
});
