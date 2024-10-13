// content.js

chrome.storage.local.get(['extensionActive'], function(result) {
  if (result.extensionActive) {
    if (!window.hasRunContentScript) {
      window.hasRunContentScript = true;

      let items = [];

      // Predefined list of Paint Seeds to highlight
      const paintSeedList = [568, 123, 456]; // Replace with your desired seed values

      // Extract Steam ID from the URL
      const url = window.location.href;
      const steamIdMatch = url.match(/\/id\/(\w+)|\/profiles\/(\d+)/);
      const steamId = steamIdMatch ? (steamIdMatch[1] || steamIdMatch[2]) : 'unknown';

      // Create a new element to display the count of selected items
      const countElement = document.createElement('div');
      countElement.id = 'selected-items-count';
      countElement.style.position = 'fixed';
      countElement.style.top = '10px';
      countElement.style.left = '10px';
      countElement.style.padding = '10px';
      countElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      countElement.style.color = 'white';
      countElement.style.fontSize = '16px';
      countElement.style.zIndex = '9999';
      document.body.appendChild(countElement);

      // Create a new element to display the names of selected items
      const itemsListElement = document.createElement('ul');
      itemsListElement.id = 'selected-items-list';
      itemsListElement.style.position = 'fixed';
      itemsListElement.style.top = '50px'; // Adjusted position below the count
      itemsListElement.style.left = '10px';
      itemsListElement.style.padding = '10px';
      itemsListElement.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      itemsListElement.style.color = 'white';
      itemsListElement.style.fontSize = '14px';
      itemsListElement.style.zIndex = '9999';
      itemsListElement.style.display = 'none'; // Initially hide the list
      document.body.appendChild(itemsListElement);

      function updateCount() {
        countElement.textContent = `Selected Items: ${items.length}`;
        itemsListElement.innerHTML = ''; // Clear current list

        if (items.length === 0) {
          itemsListElement.style.display = 'none'; // Hide list if empty
        } else {
          itemsListElement.style.display = 'block'; // Show list if not empty
          items.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.name;
            itemsListElement.appendChild(listItem);
          });
        }
      }

      function attachClickListeners() {
        document.querySelectorAll('.itemHolder').forEach(holder => {
          holder.removeEventListener('dblclick', handleClick); // Remove previous listeners
          holder.addEventListener('dblclick', handleClick);
        });
      }

      function handleClick(event) {
        const itemNameElement = document.querySelector('.hover_item_name');
        const itemActionElement = document.querySelector('.item_actions a');
        const csfloatElement = document.querySelector('csfloat-selected-item-info');

        const itemName = itemNameElement ? itemNameElement.innerText.replace(/\s+/g, ' ').trim() : 'N/A';
        const itemActionLink = itemActionElement ? itemActionElement.href : 'N/A';

        let floatValue = 'N/A';
        let paintSeed = 'N/A';

        if (csfloatElement) {
          const shadowRoot = csfloatElement.shadowRoot;
          const floatElement = shadowRoot.querySelector('.container div:nth-child(1)');
          const paintSeedElement = shadowRoot.querySelector('.container div:nth-child(2)');

          if (floatElement) {
            let floatText = floatElement.textContent.split(': ')[1].trim();
            floatValue = floatText.split(' ')[0].replace(/[\n\r]+/g, '').replace(/"/g, ''); // Remove rank and extra characters
          }

          if (paintSeedElement) {
            let paintSeedText = paintSeedElement.textContent.split(': ')[1].trim();
            paintSeed = paintSeedText.split(' ')[0].replace(/[\n\r]+/g, '').replace(/"/g, ''); // Remove phase and extra characters
          }
        }

        const itemIndex = items.findIndex(item => item.name === itemName && item.link === itemActionLink && item.float === floatValue && item.paintSeed === paintSeed);

        if (event.ctrlKey) {
          // Ctrl + Double-click to remove item
          if (itemIndex !== -1) {
            items.splice(itemIndex, 1);
            // Remove green border from the item holder
            let innerDiv = event.currentTarget.querySelector('.inner-border');
            if (innerDiv) {
              innerDiv.remove();
            }
            updateCount();
          }
        } else {
          // Double-click to add item
          if (itemIndex === -1) {
            items.push({ name: itemName, link: itemActionLink, float: floatValue, paintSeed: paintSeed });

            // Add inner div with green border to the item holder
            let innerDiv = event.currentTarget.querySelector('.inner-border');
            if (!innerDiv) {
              innerDiv = document.createElement('div');
              innerDiv.className = 'inner-border';
              innerDiv.style.position = 'absolute';
              innerDiv.style.top = '0';
              innerDiv.style.left = '0';
              innerDiv.style.right = '0';
              innerDiv.style.bottom = '0';
              innerDiv.style.border = '3px solid green';
              event.currentTarget.style.position = 'relative'; // Ensure the holder is positioned relative for the inner div
              event.currentTarget.appendChild(innerDiv);
            }
            updateCount();
          }
        }

        console.log('Items:', items);
      }

      // Function to highlight Paint Seeds
      function highlightPaintSeeds() {
          const listingBlocks = document.querySelectorAll('.market_listing_item_name_block');

          listingBlocks.forEach(block => {
              const floatRow = block.querySelector('.float-row-wrapper');
              if (floatRow) {
                  const paintSeedMatch = floatRow.innerText.match(/Paint Seed:\s*(\d+)/);
                  if (paintSeedMatch && paintSeedMatch[1]) {
                      const paintSeed = parseInt(paintSeedMatch[1], 10);
                      
                      if (paintSeedList.includes(paintSeed)) {
                          block.classList.add('highlight-paint-seed');
                      } else {
                          block.classList.remove('highlight-paint-seed'); // Remove if not in list
                      }
                  }
              }
          });
      }

      // Function to initialize all features
      function initExtensionFeatures() {
          // Existing features initialization
          updateCount();
          attachClickListeners();
          highlightPaintSeeds();
      }

      const observer = new MutationObserver((mutationsList, observer) => {
        attachClickListeners();
        highlightPaintSeeds(); // Highlight seeds whenever DOM changes
      });

      // Start observing the target node for configured mutations
      const targetNode = document.querySelector('.trade_item_box.selectableNone');
      if (targetNode) {
          observer.observe(targetNode, {
              childList: true,
              subtree: true
          });
      }

      // Initial initialization
      initExtensionFeatures();

      chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        if (request.action === 'downloadCSV') {
          downloadCSV(items);
        } else if (request.action === 'getItemCount') {
          sendResponse({ count: items.length });
        } else if (request.action === 'resetItems') {
          items = [];
          updateCount();
          // Remove inner divs with green border from all item holders
          document.querySelectorAll('.inner-border').forEach(border => border.remove());
        }
      });

      function downloadCSV(items) {
        const csvContent = "data:text/csv;charset=utf-8,Name,Link,Float,Paint_Seed\n" + items.map(item => `"${item.name}","${item.link}","${item.float}","${item.paintSeed}"`).join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `${steamId}_skins.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      // Initial count update
      updateCount();
    }
  }
});
