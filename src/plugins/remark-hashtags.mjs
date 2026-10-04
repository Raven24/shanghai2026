/**
 * Remark plugin to transform hashtags in markdown text nodes into styled spans.
 * 
 * Traverses the markdown AST and replaces hashtags (#word) in text nodes with
 * HTML spans marked with class "hashtag". Supports unicode letters (including umlauts),
 * numbers, and underscores: #wort, #Straße, #photo_2024
 * 
 * Example: "#shanghai #backalley" → "<span class=\"hashtag\">#shanghai</span> <span class=\"hashtag\">#backalley</span>"
 */

const HASHTAG_REGEX = /(^|\s)(#[\p{L}\p{N}_]+)/gu;

function processNode(node) {
  if (node.type === 'text') {
    // Check if this text node contains any hashtags
    if (HASHTAG_REGEX.test(node.value)) {
      // Reset regex state before replacement
      HASHTAG_REGEX.lastIndex = 0;
      
      // Replace hashtags with HTML spans, preserving whitespace before them
      const html = node.value.replace(HASHTAG_REGEX, '$1<span class="hashtag">$2</span>');
      
      // Convert text node to raw HTML node
      node.type = 'html';
      node.value = html;
    }
  }
  
  // Recursively process children if they exist
  if (node.children && Array.isArray(node.children)) {
    node.children.forEach(processNode);
  }
}

export default function remarkHashtags() {
  return (tree) => {
    processNode(tree);
  };
}
