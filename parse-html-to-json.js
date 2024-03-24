const fs = require('fs');
const cheerio = require('cheerio');

const parseHTMLToJSON = (htmlString) => {
  const $ = cheerio.load(htmlString);

  const parseNode = (node) => {
    const element = {
      tagName: node.tagName,
      ...node.attribs,
      content: $(node).contents().map((_, contentNode) => {
        if (contentNode.nodeType === 3) { // Текстовые узлы
          return contentNode.nodeValue.trim();
        } else if (contentNode.nodeType === 1) { // Элементы
          return parseNode(contentNode);
        }
      }).get().filter(Boolean) // Удаление пустых элементов
      // Другие атрибуты можно добавить по необходимости
    };
  
    return element;
  };
  
  return parseNode($.root()[0]);
};

// Пример чтения HTML из файла и преобразования в JSON
fs.readFile('doc.docx/doc.docx.html', 'utf8', (err, htmlString) => {
  if (err) {
    console.error('Ошибка чтения файла:', err);
    return;
  }

  const jsonResult = parseHTMLToJSON(htmlString);

  // Сохранение результата в JSON-файл
  fs.writeFile('output.json', JSON.stringify(jsonResult, null, 2), (err) => {
    if (err) {
      console.error('Ошибка записи файла:', err);
      return;
    }
  });
});

