<script>
  export let textContent;

  $: isEmpty = !textContent || !textContent.trim();
  $: parsed = parseText(textContent);

  // Helper function to check if a string is a URL
  function isLink(text) {
    try {
      new URL(text);
      return true;
    } catch (e) {
      return false;
    }
  }

  // Define a unique key for the video URL within the first cell object
  const VIDEO_URL_KEY = "videoHref";

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
        if (currentSection.bullets.length > 0 || currentSection.table.length > 0) {
          sections.push(currentSection);
        } else if (currentSection.header) {
          sections.push(currentSection);
        }
        currentSection = null;
      }
    }

    let state = 'await-header';

    for (let i = 0; i < lines.length; i++) {
      const rawLine = lines[i];
      const line = rawLine.trim();

      if (plainMode) {
        sections.push({ mode: 'plain-line', content: rawLine });
        continue;
      }

      if (line === '') {
        if (currentSection) {
          commitSection();
          state = 'await-header';
        }
        continue;
      }

      if (state === 'await-header') {
        if (line.includes(';')) {
          plainMode = true;
          sections = [];
          for (let j = 0; j <= i; j++) {
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
          state = 'table';
          currentSection.table.push(processTableRowForVideo(line));
        } else {
          currentSection.bullets.push(line);
        }
        continue;
      }

      if (state === 'table') {
        if (line.includes(';')) {
          currentSection.table.push(processTableRowForVideo(line));
        } else {
          commitSection();
          currentSection = { header: line, bullets: [], table: [] };
          state = 'bullets-or-table';
        }
      }
    }

    commitSection();

    if (plainMode || sections.length === 0 || sections.every(s => s.mode === 'plain-line')) {
        return {
            mode: 'plain',
            lines: lines.map(l => l)
        };
    }

    function processTableRowForVideo(lineContent) {
      const rawCells = lineContent.split(';').map(cell => cell.trim());
      let videoLinkFound = null;
      let finalCells = [];

      for (let k = 0; k < rawCells.length; k++) {
        if (isLink(rawCells[k])) {
          videoLinkFound = rawCells[k];
        } else {
          finalCells.push(rawCells[k]);
        }
      }

      if (videoLinkFound) {
        if (finalCells.length === 0) {
            finalCells.push('');
        }
        finalCells[0] = {
            content: finalCells[0],
            [VIDEO_URL_KEY]: videoLinkFound
        };
      }
      return finalCells;
    }

    sections.forEach(section => {
      if (section.table && section.table.length > 0) {
        let maxCols = 0;
        section.table.forEach(row => {
          maxCols = Math.max(maxCols, row.length);
        });
        section.maxColumns = maxCols;
      }
    });

    return { mode: 'structured', sections };
  }
</script>

<style>
  /* Simple table cell border */
  table {
    border-collapse: collapse;
    margin-bottom: 0.5em;
    width: 100%;
  }

  td {
    border: 1px solid #ccc;
    padding: 0.18em 0.25em;
    font-size: 0.98em;
    vertical-align: top;
    white-space: normal; /* Allow text to wrap by default */
  }

  /* Standard link style for the video link */
  .video-cell-link {
    color: #0160cc; /* Standard blue link color */
    text-decoration: none; /* No underline by default */
  }

  .video-cell-link:hover {
    background: none;
    text-decoration: underline; /* Underline on hover */
  }

  ul {
    margin-bottom: 0.5em;
    padding-left: 1.1em;
  }

  h1 {
    margin-top: 0.3em;
    margin-bottom: 0.08em;
    font-size: 1.05em;
  }
</style>

{#if parsed.mode === 'empty'}
  <p>No content to display</p>
{:else if parsed.mode === 'plain'}
  {#each parsed.lines as line}
    {#if line.trim() === ''}
      <p> </p>
    {:else}
      <p>{line}</p>
    {/if}
  {/each}
{:else if parsed.mode === 'structured'}
  {#each parsed.sections as section, i (i)}
    {#if section && Object.prototype.hasOwnProperty.call(section, 'header')}
      <h1>{section.header}</h1>
      {#if section.bullets && section.bullets.length}
        <ul>
          {#each section.bullets as bullet}
            <li>{bullet}</li>
          {/each}
        </ul>
      {/if}
      {#if section.table && section.table.length}
        <table>
          <tbody>
            {#each section.table as row}
              <tr>
                {#each row as cell, colIndex}
                  {#if colIndex === 0 && typeof cell === 'object' && cell[VIDEO_URL_KEY]}
                    <td>
                      <a href={cell[VIDEO_URL_KEY]} target="_blank" rel="noopener noreferrer" class="video-cell-link">
                        {cell.content}
                      </a>
                    </td>
                  {:else}
                    <td>{cell}</td>
                  {/if}
                {/each}
                {#if section.maxColumns && row.length < section.maxColumns}
                  {#each Array(section.maxColumns - row.length) as _, k}
                    <td></td>
                  {/each}
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      {/if}
    {:else if section && Object.prototype.hasOwnProperty.call(section, 'content')}
      <p>{section.content}</p>
    {/if}
  {/each}
{/if}