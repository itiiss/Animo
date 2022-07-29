/**
 * @param inputText
 * @param backupRatio 
 * 
 * @returns {number} numeric value of width in pixels
 */
 export const getTextWidth = (() => {
    const container = document.createElement('canvas');
  
    return function (inputText?: string | number | null, backupRatio = 0.5): number {
      let width = 0;
      let text = inputText ?? '';
      text = text.toString();
  
      let context = container.getContext('2d');
  
      if (context) {
        context.font = window
          .getComputedStyle(document.body)
          .getPropertyValue('font');
        width = context.measureText(text).width;
        return width;
      } else {
        let fontSize = parseFloat(
          window.getComputedStyle(document.body).getPropertyValue('font-size')
        );
        return fontSize * backupRatio * text.length;
      }
    };
  })();