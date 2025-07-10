<script>
  export let textContent;

  $: isEmpty = !textContent || !textContent.trim();
  $: parsed = parseText(textContent);

  function parseText(text) {
    if (!text || typeof text !== 'string' || !text.trim()) {
      return { mode: 'empty' };
    }

    const lines = text.split('\n');
    let sections = [];
    let currentSection = null;
    let plainMode = false;

    function commitSection() {
      if (currentSection) {
        // Ensure no empty bullets or tables are pushed
        if (currentSection.bullets.length > 0 || currentSection.table.length > 0) {
          sections.push(currentSection);
        } else if (currentSection.header) { // Allow sections with just a header
          sections.push(currentSection);
        }
        currentSection = null;
      }
    }

    let state = 'await-header';

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.trim();

      // If in plain mode, just collect all lines
      if (plainMode) {
        sections.push({ mode: 'plain-line', content: rawLine }); // Store rawLine to preserve leading/trailing spaces for plain mode
        continue;
      }

      // Check for empty lines to potentially signify end of a section's content
      if (line === '') {
        if (currentSection) {
          // If we are in a section and encounter an empty line, commit the section
          // and reset state to await-header for the next section.
          commitSection();
          state = 'await-header';
        }
        continue; // Skip processing the empty line further
      }

      if (state === 'await-header') {
        if (line.includes(';')) {
          // If the first non-empty line contains a semicolon, it's not a header.
          // This implies the whole text should be plain.
          plainMode = true;
          // Restart parsing in plain mode for all lines
          sections = []; // Clear any partially parsed sections
          for (let j = 0; j <= i; j++) { // Process current and previous lines in plain mode
            sections.push({ mode: 'plain-line', content: lines[j] });
          }
          continue;
        }
        currentSection = { header: line, bullets: [], table: [] };
        state = 'bullets-or-table';
        continue;
      }

      if (state === 'bullets-or-table') {
        if (line.includes(';')) {
          // It's a table row
          state = 'table';
          currentSection.table.push(line.split(';').map(cell => cell.trim()));
        } else {
          // It's a bullet point
          currentSection.bullets.push(line);
        }
        continue;
      }

      if (state === 'table') {
        if (line.includes(';')) {
          currentSection.table.push(line.split(';').map(cell => cell.trim()));
        } else {
          // If in table mode and a line without a semicolon appears,
          // it signifies the end of the current table and the start of a new section.
          commitSection();
          currentSection = { header: line, bullets: [], table: [] };
          state = 'bullets-or-table';
        }
      }
    }

    commitSection(); // Commit the last section

    // Final check for plain mode if no structured sections were formed.
    if (plainMode || sections.length === 0 || sections.every(s => s.mode === 'plain-line')) {
        // If plainMode was activated, or no structured sections were successfully parsed,
        // or all sections are already marked as plain-line, then return as full plain text.
        return {
            mode: 'plain',
            lines: lines.map(l => l)
        };
    }

    return { mode: 'structured', sections };
  }
</script>

<style>
  /* Simple table cell border */
  table {
    border-collapse: collapse;
    margin-bottom: 1em;
  }
  td {
    border: 1px solid #ccc;
    padding: 0.25em 0.5em;
  }
  ul {
    margin-bottom: 1em;
  }
  h1 {
    margin-top: 1.5em;
    margin-bottom: 0.5em;
    font-size: 1.3em;
  }
</style>

{#if parsed.mode === 'empty'}
  <p>No content to display</p>
{:else if parsed.mode === 'plain'}
  {#each parsed.lines as line}
    {#if line.trim() === ''}
      <p>&nbsp;</p>
    {:else}
      <p>{line}</p>
    {/if}
  {/each}
{:else if parsed.mode === 'structured'}
  {#each parsed.sections as section}
    <h1>{section.header}</h1>
    {#if section.bullets.length}
      <ul>
        {#each section.bullets as bullet}
          <li>{bullet}</li>
        {/each}
      </ul>
    {/if}
    {#if section.table.length}
      <table>
        {#each section.table as row}
          <tr>
            {#each row as cell}
              <td>{cell}</td>
            {/each}
          </tr>
        {each}
      </table>
    {/if}
  {/each}
{/if}