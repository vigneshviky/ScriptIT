// --- Responsive tab logic for mobile/desktop ---
function handleResponsiveTabs() {
  const writePanel = document.getElementById('writePanel');
  const previewPanel = document.getElementById('previewPanel');
  const writeTab = document.getElementById('write-tab');
  const previewTab = document.getElementById('preview-tab');
  if (window.innerWidth < 768) {
    // Mobile: show only selected tab
    if (writeTab && previewTab && writePanel && previewPanel) {
      if (writeTab.classList.contains('active')) {
        writePanel.classList.add('show', 'active');
        previewPanel.classList.remove('show', 'active');
        previewPanel.classList.add('d-none');
        writePanel.classList.remove('d-none');
      } else {
        previewPanel.classList.add('show', 'active');
        writePanel.classList.remove('show', 'active');
        writePanel.classList.add('d-none');
        previewPanel.classList.remove('d-none');
      }
    }
  } else {
    // Desktop: show both
    if (writePanel && previewPanel) {
      writePanel.classList.add('show', 'active');
      previewPanel.classList.add('show', 'active');
      writePanel.classList.remove('d-none');
      previewPanel.classList.remove('d-none');
    }
  }
}

window.addEventListener('resize', handleResponsiveTabs);
document.addEventListener('DOMContentLoaded', function() {
  handleResponsiveTabs();
  // Bootstrap tab event
  const writeTab = document.getElementById('write-tab');
  const previewTab = document.getElementById('preview-tab');
  if (writeTab && previewTab) {
    writeTab.addEventListener('shown.bs.tab', handleResponsiveTabs);
    previewTab.addEventListener('shown.bs.tab', handleResponsiveTabs);
  }
});

// --- DOM Elements (move to top for reliability) ---
const input = document.getElementById('input');
const preview = document.getElementById('preview');
const titleInput = document.getElementById('scriptTitle');
const authorInput = document.getElementById('scriptAuthor');
const contactInput = document.getElementById('scriptContact');
const dateInput = document.getElementById('scriptDate');
const exportFountainBtn = document.getElementById('exportFountain');
const exportPDFBtn = document.getElementById('exportPDF');
const titleArea = document.getElementById('titleArea');
const openFountainBtn = document.getElementById('openFountainBtn');
const openFountainInput = document.getElementById('openFountain');
const templateSelectorBtn = document.getElementById('templateSelector');
const templateDropdown = document.getElementById('templateDropdown');

// --- Screenplay Structure Templates ---
const SCREENPLAY_TEMPLATES = {
  threeAct: [
    '# Act 1',
    '',
    '# Act 2',
    '',
    '# Act 3',
    ''
  ],
  blakeSnyder: [
    '# Opening Image', '', '# Theme Stated', '', '# Set-Up', '', '# Catalyst', '', '# Debate', '', '# Break Into Two', '', '# B Story', '', '# Fun and Games', '', '# Midpoint', '', '# Bad Guys Close In', '', '# All Is Lost', '', '# Dark Night of the Soul', '', '# Break Into Three', '', '# Finale', '', '# Final Image', ''
  ],
  eightSeq: [
    '# Sequence 1', '', '# Sequence 2', '', '# Sequence 3', '', '# Sequence 4', '', '# Sequence 5', '', '# Sequence 6', '', '# Sequence 7', '', '# Sequence 8', ''
  ],
  herosJourney: [
    '# Ordinary World', '', '# Call to Adventure', '', '# Refusal of the Call', '', '# Meeting the Mentor', '', '# Crossing the Threshold', '', '# Tests, Allies, Enemies', '', '# Approach to the Inmost Cave', '', '# Ordeal', '', '# Reward', '', '# The Road Back', '', '# Resurrection', '', '# Return with the Elixir', ''
  ],
  danHarmon: [
    '# 1. You (A character is in a zone of comfort)', '', '# 2. Need (But they want something)', '', '# 3. Go (They enter an unfamiliar situation)', '', '# 4. Search (Adapt to it)', '', '# 5. Find (Get what they wanted)', '', '# 6. Take (Pay a heavy price)', '', '# 7. Return (Return to their familiar situation)', '', '# 8. Change (Having changed)', ''
  ]
};

// Template selector logic: allow switching if script is unchanged from last template insert
let lastTemplateScript = null;
let lastTemplateKey = null;
if (templateDropdown) {
  templateDropdown.querySelectorAll('.template-option').forEach(opt => {
    opt.addEventListener('click', (e) => {
      e.preventDefault();
      const key = opt.getAttribute('data-template');
      if (SCREENPLAY_TEMPLATES[key]) {
        // If a template was previously inserted, check if script is unchanged
        if (lastTemplateScript !== null) {
          if (input.value !== lastTemplateScript) {
            alert('You have already edited the script. Please export your script as a .fountain file before changing the template.');
            return;
          }
        }
        input.value = SCREENPLAY_TEMPLATES[key].join('\n');
        render();
        lastTemplateScript = input.value;
        lastTemplateKey = key;
      }
    });
  });
}
// Update lastTemplateScript if user picks a template, and clear if user edits
if (input) {
  input.addEventListener('input', function() {
    if (lastTemplateScript !== null && input.value !== lastTemplateScript) {
      // User has edited the script
      // Do not clear lastTemplateScript, just note that it's now edited
    }
  });
}

// Unlock template change after export
if (exportFountainBtn) {
  exportFountainBtn.addEventListener('click', function() {
    templateLocked = false;
  });
}

// Toggle title area (arrow button)
document.getElementById("toggleTitle").addEventListener("click", () => {
  const titleBar = document.querySelector(".titlebar-center");
  titleBar.classList.toggle("hide");
});

// Open .fountain file
if (openFountainBtn && openFountainInput) {
  openFountainBtn.addEventListener('click', () => openFountainInput.click());
  openFountainInput.addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(evt) {
      const text = evt.target.result;
      // Try to parse title page fields if present
      let script = text;
      let title = '', author = '', contact = '', date = '';
      const titleMatch = text.match(/^Title:\s*(.*)$/im);
      const authorMatch = text.match(/^Author:\s*(.*)$/im);
      const contactMatch = text.match(/^Contact:\s*(.*)$/im);
      const dateMatch = text.match(/^Draft date:\s*(.*)$/im);
      if (titleMatch) title = titleMatch[1];
      if (authorMatch) author = authorMatch[1];
      if (contactMatch) contact = contactMatch[1];
      if (dateMatch) date = dateMatch[1];
      // Remove title page from script
      script = script.replace(/^Title:.*$/gim, '').replace(/^Author:.*$/gim, '').replace(/^Contact:.*$/gim, '').replace(/^Draft date:.*$/gim, '').replace(/^\s*\n/gm, '');
      if (title) titleInput.value = title;
      if (author) authorInput.value = author;
      if (contact) contactInput.value = contact;
      if (date) dateInput.value = date;
      input.value = script.trim();
      render();
    };
    reader.readAsText(file);
  });
}





function detectType(line, prevType) {
  const t = line.trim();

  if (/^(;|\/\/)/.test(t)) return 'comment';

  if (/^(INT\/EXT|INT|EXT)(\.|\s)/i.test(t)) return 'scene';

  if (/^[A-Z0-9 ]{2,}$/.test(t) && t.length < 40) return 'character';

  // ✅ FIX: Parenthetical detection
  if (/^\(.*\)$/.test(t)) return 'parenthetical';

  if (t.length === 0) return 'action';

  if (prevType === 'character' || prevType === 'parenthetical') {
    return 'dialogue';
  }

  return 'action';
}

function getTitlePageFountain() {
  return `Title: ${titleInput.value}\nAuthor: ${authorInput.value}\nContact: ${contactInput.value}\nDraft date: ${dateInput.value}\n\n`;
}

function getTitlePageHTML() {
  return `<div class="title-page"><div><strong>${titleInput.value}</strong></div><div>${authorInput.value}</div><div>${contactInput.value}</div><div>${dateInput.value}</div><br></div>`;
}

function render() {
  const lines = input.value.split('\n');
  let html = `<div class="script-page">` + getTitlePageHTML();
  let lastType = 'action';
  for (let line of lines) {
    // Section heading: line starts with #
    if (/^#\s?/.test(line.trim())) {
      const section = line.replace(/^#\s?/, '').replace(/</g, '&lt;').replace(/>/g, '&gt;');
      html += `<div class="section-heading">${section}</div><hr class="section-separator">`;
      lastType = 'action';
      continue;
    }
    const type = detectType(line, lastType) || lastType;
    lastType = type;
    // Use non-breaking space for empty lines to preserve spacing
    const safeLine = line.length === 0 ? '&nbsp;' : line.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (type === 'scene') {
      html += `<div class="scene"><strong>${safeLine}</strong></div>`;
    } else {
      html += `<div class="${type}">${safeLine}</div>`;
    }
  }
  preview.innerHTML = html;
  // Save all fields to localStorage
  localStorage.setItem('fountain_script', input.value);
  localStorage.setItem('fountain_title', titleInput.value);
  localStorage.setItem('fountain_author', authorInput.value);
  localStorage.setItem('fountain_contact', contactInput.value);
  localStorage.setItem('fountain_date', dateInput.value);
  html += `</div>`;
  preview.innerHTML = html;
}

input.addEventListener('input', render);
titleInput.addEventListener('input', render);
authorInput.addEventListener('input', render);
contactInput.addEventListener('input', render);
dateInput.addEventListener('input', render);

// Export .fountain file
if (exportFountainBtn) {
  exportFountainBtn.addEventListener('click', function() {
    const blob = new Blob([
      getTitlePageFountain() + input.value
    ], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = (titleInput.value || 'script') + '.fountain';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
}

// Export PDF (simple, print preview)
if (exportPDFBtn) {
  exportPDFBtn.addEventListener('click', function() {
    const win = window.open('', '_blank');

    win.document.write(`
      <html>
      <head>
        <title>${titleInput.value}</title>
        <style>
          body {
            background: white;
            color: black;
            font-family: Courier, monospace;
            padding: 40px;
          }

          .scene { font-weight: bold; text-transform: uppercase; margin: 16px 0; }
          .character { text-align: center; margin-top: 12px; }
          .parenthetical { text-align: center; font-style: italic; }
          .dialogue { text-align: center; margin-bottom: 10px; }
          .action { margin-bottom: 10px; }
          .section-heading {
            font-size: 14px;
            font-weight: bold;
            text-align: right;
            color: #000;
            margin-top: 20px;
          }

          .section-separator {
            border: none;
            border-top: 1px solid #999;
            margin: 6px 0 12px;
          }

        </style>
      </head>
      <body>
        ${preview.innerHTML}
      </body>
      </html>
    `);

    win.document.close();
    setTimeout(() => win.print(), 500);
  });
}

const SAMPLE_SCRIPT = `# Sample Scene

INT. COFFEE SHOP - DAY

A quiet café. Sunlight pours through the windows. People sit scattered, lost in their own worlds.

A man in his 30s sits alone, staring at a notebook.

He writes something. Stops. Crosses it out.

JOHN
(softly)
This is not how it was supposed to go.

He looks up. Watches people.

A couple laughs loudly in the corner.

JOHN
(to himself)
Or maybe... this is exactly how it goes.

# Tip

Switch to Preview tab to see formatted screenplay.
`;

// Load from localStorage
window.onload = function() {

// Hide title form by default
document.addEventListener("DOMContentLoaded", () => {
  const titleBar = document.querySelector(".titlebar-center");
  if (titleBar) {
    titleBar.classList.add("hide");
  }
});

  const saved = localStorage.getItem('fountain_script');
  if (titleArea) {
  titleArea.classList.add('hide');
}
  if (saved) {
    input.value = saved;
  } else {
    input.value = SAMPLE_SCRIPT;
  }
  if (localStorage.getItem('fountain_title')) titleInput.value = localStorage.getItem('fountain_title');
  if (localStorage.getItem('fountain_author')) authorInput.value = localStorage.getItem('fountain_author');
  if (localStorage.getItem('fountain_contact')) contactInput.value = localStorage.getItem('fountain_contact');
  if (localStorage.getItem('fountain_date')) dateInput.value = localStorage.getItem('fountain_date');
  render();
};
// SIMPLE MOBILE TAB FIX
if (window.innerWidth < 768) {
  const writeTab = document.getElementById("write-tab");
  const previewTab = document.getElementById("preview-tab");

  const writePanel = document.getElementById("writePanel");
  const previewPanel = document.getElementById("previewPanel");

  writeTab.addEventListener("click", () => {
    writePanel.style.display = "block";
    previewPanel.style.display = "none";
  });

  previewTab.addEventListener("click", () => {
    writePanel.style.display = "none";
    previewPanel.style.display = "block";
  });

  // Default
  previewPanel.style.display = "none";
}
const exportButtons = document.querySelector('.export-buttons');

if (window.innerWidth < 768 && exportButtons) {

  const writeTab = document.getElementById("write-tab");
  const previewTab = document.getElementById("preview-tab");

  writeTab.addEventListener("click", () => {
    exportButtons.style.display = "none";
  });

  previewTab.addEventListener("click", () => {
    exportButtons.style.display = "flex";
  });

  // Default hidden
  exportButtons.style.display = "none";
}

const helpBtn = document.getElementById("helpBtn");
const helpPopup = document.getElementById("helpPopup");
const closeHelp = document.getElementById("closeHelp");
const helpOverlay = document.querySelector(".help-overlay");

if (helpBtn) {
  helpBtn.addEventListener("click", () => {
    helpPopup.classList.remove("hidden");
  });
}

// close by X button
if (closeHelp) {
  closeHelp.addEventListener("click", () => {
    helpPopup.classList.add("hidden");
  });
}

// close by clicking outside
if (helpOverlay) {
  helpOverlay.addEventListener("click", () => {
    helpPopup.classList.add("hidden");
  });
}
