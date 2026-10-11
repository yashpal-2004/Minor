// Table of Contents Generator & Print Handler

document.addEventListener('DOMContentLoaded', function() {
  generateTableOfContents();
  setupPrintButton();
});

function generateTableOfContents() {
  const main = document.querySelector('main');
  if (!main) return;

  // Collect all headings
  const headings = main.querySelectorAll('h1, h2, h3, h4');
  const toc = [];

  headings.forEach((heading, index) => {
    // Skip the main title
    if (heading.classList.contains('title')) return;

    // Assign ID if not present
    if (!heading.id) {
      heading.id = `section-${index}`;
    }

    const level = parseInt(heading.tagName[1]);
    
    toc.push({
      id: heading.id,
      text: heading.textContent.trim(),
      level: level
    });
  });

  if (toc.length === 0) return;

  // Create TOC container
  const tocContainer = document.createElement('div');
  tocContainer.className = 'toc-container';
  
  const tocHeader = document.createElement('div');
  tocHeader.className = 'toc-header';
  
  const tocTitle = document.createElement('h3');
  tocTitle.textContent = '📋 Table of Contents';
  
  const tocToggle = document.createElement('div');
  tocToggle.className = 'toc-toggle';
  tocToggle.textContent = '▼';
  
  tocHeader.appendChild(tocTitle);
  tocHeader.appendChild(tocToggle);
  
  const tocContent = document.createElement('div');
  tocContent.className = 'toc-content';
  
  const tocList = document.createElement('ul');
  tocList.className = 'toc-list';
  
  toc.forEach(item => {
    const li = document.createElement('li');
    li.className = `level-${item.level}`;
    
    const link = document.createElement('a');
    link.href = `#${item.id}`;
    link.textContent = item.text;
    link.onclick = function(e) {
      // Smooth scroll
      document.getElementById(item.id).scrollIntoView({ behavior: 'smooth' });
      return false;
    };
    
    li.appendChild(link);
    tocList.appendChild(li);
  });
  
  tocContent.appendChild(tocList);
  tocContainer.appendChild(tocHeader);
  tocContainer.appendChild(tocContent);
  
  // Insert TOC after title/subtitle
  const subtitle = main.querySelector('.subtitle');
  if (subtitle) {
    subtitle.parentNode.insertBefore(tocContainer, subtitle.nextSibling);
  } else {
    main.insertBefore(tocContainer, main.firstChild.nextSibling);
  }
  
  // Toggle functionality
  tocHeader.addEventListener('click', function() {
    tocContent.classList.toggle('hidden');
    tocToggle.classList.toggle('collapsed');
  });
}

function setupPrintButton() {
  // Add print button to main
  const main = document.querySelector('main');
  if (!main) return;

  const printBtn = document.createElement('button');
  printBtn.className = 'print-btn';
  printBtn.innerHTML = '🖨️ Print / PDF';
  printBtn.onclick = function() {
    // Expand all TOC and collapsed sections for printing
    const tocContent = document.querySelector('.toc-content');
    if (tocContent && tocContent.classList.contains('hidden')) {
      tocContent.classList.remove('hidden');
    }
    
    // Expand all details
    document.querySelectorAll('details').forEach(detail => {
      detail.setAttribute('open', 'open');
    });
    
    // Print
    window.print();
  };

  // Add print button styling
  const style = document.createElement('style');
  style.textContent = `
    .print-btn {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: var(--accent);
      color: white;
      border: none;
      padding: 12px 20px;
      border-radius: 10px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(120, 81, 169, 0.3);
      transition: all 0.3s;
      font-size: 14px;
      font-family: 'Segoe Print', cursive, sans-serif;
      z-index: 999;
    }
    
    .print-btn:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 16px rgba(120, 81, 169, 0.4);
    }
    
    @media print {
      .print-btn {
        display: none;
      }
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(printBtn);
}
