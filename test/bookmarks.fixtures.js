function makeBookmarksArray() {
    return [
      {
        id: 1,
        title: 'Website #1',
        url: 'https://www.google.com',
        rating: 5,
        description: 'Website #1 description',
      },
      {
        id: 2,
        title: 'Website #2',
        url: 'https://www.google.com',
        rating: 5,
        description: 'Website #2 description',
      },
      {
        id: 3,
        title: 'Website #3',
        url: 'https://www.google.com',
        rating: 5,
        description: 'Website #3 description',
      },
    ];
  }

  function makeMaliciousBookmark() {
    const maliciousBookmark = {
      id: 911,
      title: 'Naughty naughty very naughty <script>alert("xss");</script>',
      url: 'https://www.google.com',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      rating: 1,
    }
    const expectedBookmark = {
      ...maliciousBookmark,
      title: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      description: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      rating: 1,
    }
    return {
      maliciousBookmark,
      expectedBookmark
    }
  }
  
  module.exports = {
    makeBookmarksArray,
    makeMaliciousBookmark,
  }