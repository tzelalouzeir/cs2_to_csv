// Pattern categories
const tier1Patterns = [490];
const tier2Patterns = [148, 69, 704];
const rank1Patterns = [16, 48, 66, 67, 96, 111, 117, 159, 259, 263, 273, 297, 308, 321, 324, 341, 347, 461, 482, 517, 530, 567, 587, 674, 695, 723, 764, 772, 781, 790, 792, 843, 880, 885, 904, 948, 990];
const rank2Patterns = [109, 116, 134, 158, 168, 225, 338, 354, 356, 365, 370, 386, 406, 426, 433, 441, 483, 537, 542, 592, 607, 611, 651, 668, 673, 696, 730, 743, 820, 846, 856, 857, 870, 876, 878, 882, 898, 900, 925, 942, 946, 951, 953, 970, 998];
const purplePatterns = [29, 31, 33, 43, 72, 85, 88, 88, 99, 104, 105, 128, 133, 136, 139, 140, 146, 146, 156, 172, 174, 176, 189, 216, 217, 249, 265, 290, 293, 310, 310, 322, 339, 340, 343, 363, 395, 404, 411, 437, 449, 451, 453, 458, 463, 487, 496, 509, 532, 550, 572, 572, 574, 598, 599, 605, 606, 614, 621, 627, 631, 653, 666, 667, 672, 683, 707, 710, 717, 727, 734, 740, 750, 766, 778, 795, 800, 804, 806, 811, 815, 816, 817, 839, 842, 848, 849, 850, 862, 877, 891, 913, 926, 927, 944, 952, 969, 971, 989];
const goldPatterns = [4, 6, 14, 24, 37, 74, 78, 79, 80, 87, 102, 103, 124, 132, 135, 144, 167, 177, 180, 181, 182, 184, 184, 184, 205, 243, 247, 248, 252, 256, 256, 264, 269, 270, 277, 289, 292, 301, 323, 325, 334, 360, 362, 367, 374, 382, 392, 403, 428, 432, 443, 446, 466, 491, 492, 495, 505, 511, 527, 549, 555, 555, 558, 564, 568, 568, 577, 594, 604, 608, 623, 624, 629, 637, 638, 645, 646, 646, 686, 692, 733, 735, 738, 746, 783, 798, 802, 803, 813, 837, 868, 868, 887, 903, 907, 911, 914, 921, 923, 945, 986, 994];

// Softer colors for highlighting items
function categorizeAndHighlightItem(paintSeed, itemElement) {
    const rowContainer = itemElement.closest('.market_listing_row');
    
    if (tier1Patterns.includes(paintSeed)) {
      rowContainer.style.backgroundColor = 'rgba(255, 223, 0, 0.3)'; // Softer gold background (Tier 1)
    } else if (tier2Patterns.includes(paintSeed)) {
      rowContainer.style.backgroundColor = 'rgba(255, 99, 71, 0.3)'; // Softer red background (Tier 2)
    } else if (rank1Patterns.includes(paintSeed)) {
      rowContainer.style.backgroundColor = 'rgba(144, 238, 144, 0.3)'; // Softer green background (Rank 1)
    } else if (rank2Patterns.includes(paintSeed)) {
      rowContainer.style.backgroundColor = 'rgba(255, 165, 0, 0.3)'; // Softer orange background (Rank 2)
    } else if (purplePatterns.includes(paintSeed)) {
      rowContainer.style.backgroundColor = 'rgba(186, 85, 211, 0.3)'; // Softer purple background (Purple Pattern)
    } else if (goldPatterns.includes(paintSeed)) {
      rowContainer.style.backgroundColor = 'rgba(135, 206, 250, 0.3)'; // Softer blue background (Gold Pattern)
    }
  }
  
  // Function to add a floating legend in the top-left corner of the page
  function addColorLegend() {
    const legend = document.createElement('div');
    legend.id = 'color-legend';
    legend.style.position = 'fixed';
    legend.style.top = '10px';
    legend.style.left = '10px';
    legend.style.padding = '10px';
    legend.style.backgroundColor = 'rgba(255, 255, 255, 0.8)'; // Light background for the legend
    legend.style.borderRadius = '5px';
    legend.style.zIndex = '10000'; // Ensure it's always on top
    legend.style.fontSize = '12px';
    legend.style.fontFamily = 'Arial, sans-serif';
    legend.style.color = '#333'; // Dark text color
  
    // Legend content explaining each color
    legend.innerHTML = `
      <strong>Color Legend:</strong><br>
      <span style="background-color: rgba(255, 223, 0, 0.3); padding: 2px 5px; border-radius: 3px;">Tier 1</span>: Gold<br>
      <span style="background-color: rgba(255, 99, 71, 0.3); padding: 2px 5px; border-radius: 3px;">Tier 2</span>: Red<br>
      <span style="background-color: rgba(144, 238, 144, 0.3); padding: 2px 5px; border-radius: 3px;">Rank 1</span>: Green<br>
      <span style="background-color: rgba(255, 165, 0, 0.3); padding: 2px 5px; border-radius: 3px;">Rank 2</span>: Orange<br>
      <span style="background-color: rgba(186, 85, 211, 0.3); padding: 2px 5px; border-radius: 3px;">Purple Pattern</span>: Purple<br>
      <span style="background-color: rgba(135, 206, 250, 0.3); padding: 2px 5px; border-radius: 3px;">Gold Pattern</span>: Blue
    `;
  
    document.body.appendChild(legend);
  }
  
  // Function to process all rows and highlight based on Paint Seed
  function highlightRowsBasedOnPaintSeed() {
    document.querySelectorAll('.market_listing_item_name_block').forEach(itemElement => {
      const csfloatElement = itemElement.querySelector('csfloat-item-row-wrapper');
  
      if (csfloatElement && csfloatElement.shadowRoot) {
        // Access the shadow DOM of csfloat-item-row-wrapper
        const floatRowWrapper = csfloatElement.shadowRoot.querySelector('.float-row-wrapper');
        
        if (floatRowWrapper) {
          const paintSeedText = floatRowWrapper.textContent.match(/Paint Seed:\s*(\d+)/);
          const paintSeed = paintSeedText ? parseInt(paintSeedText[1], 10) : null;
  
          if (paintSeed) {
            // Categorize and highlight based on the Paint Seed
            categorizeAndHighlightItem(paintSeed, itemElement);
          }
        }
      }
    });
  }
  
  // Initial run to highlight existing items and add the legend
  highlightRowsBasedOnPaintSeed();
  addColorLegend(); // Add the floating legend explaining the colors
  
  // Observe for dynamic content and apply the highlight when new rows are added
  const observer = new MutationObserver(() => {
    highlightRowsBasedOnPaintSeed(); // Re-highlight if new items are added dynamically
  });
  
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
  