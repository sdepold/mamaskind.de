window.mamaskind = {}

window.mamaskind.transformTeaserImage = function() {
  $('.item.text .item_content p > a > img').each(function() {
    var $img    = $(this)
      , $anchor = $img.parent()

    $anchor
      .append($('<div>').addClass('tape'))
      .append($('<div>').addClass('tape'))
      .addClass('teaser-image')

    $($anchor.get(0)).fancybox()
  })
}

;(function() {
  var getGoogleQuery = function() {
    return $('.tags a').map(function() { return $(this).text() }).toArray().join(' OR ')
  }

  var getGoogleResults = function(callback) {
    var results = []

    new $.GoogleSearch().search(getGoogleQuery(), {
      site: 'mamaskind.de'
    }, function(data) {
      for (var i = 0; i < data.length; i++) {
        (function(data) {
          var isRoot    = (data.url === 'http://mamaskind.de/')
            , isCurrent = (document.location.href.indexOf(data.url) === 0)

          if (!isRoot && !isCurrent) {
            data.unescapedUrl = data.unescapedUrl.replace('http://mamaskind.de', '')
            results.push(data)
          }
        })(data[i])
      }
      callback(results)
    })
  }

  var appendSimilarPost = function($references, hit) {
    $('<div>')
      .hide()
      .appendTo($('body'))
      .load(hit.unescapedUrl + " .item_content p a img[height=80]", function() {
        var img = $(this).find('img').attr('src')

        if (!!img && ($('> div', $references).length <= 5)) {
          if ($references.find('h2').length === 0) {
            $references
              .append(
                $('<h2>')
                  .addClass('p2')
                  .text('Weitere tolle Posts:')
                  .css({ 'margin-bottom': '10px' })
              )
          }

          var $img = $('<img>').attr('src', img)

          $('<div>')
            .append(
              $('<a href="' + hit.unescapedUrl + '">')
                .addClass('teaser-image')
                .append($img)
                .append($('<div>').addClass('tape'))
                .append($('<div>').addClass('tape'))
            )
            .append(
              $('<a href="' + hit.unescapedUrl + '">')
                .text(hit.title.replace(' - mamaskind.de', ''))
                .css({
                    'padding': '110px 10px 0px 10px',
                    'display': 'block',
                    'color': '#777',
                    'font-size': '13px',
                    'font-weight': 'normal',
                    'word-break': 'break-all'
                })
            )
            .appendTo($references)
            .css({ float: 'left', width: '100px' })

          $references.find('.clearer').remove()
          $references.append($('<div>').css({clear: 'both'}).addClass("clearer"))
        }
      })
  }

  window.mamaskind.addSimilarPosts = function() {
    if (document.location.href.indexOf('http://mamaskind.de/post/') === 0) {
      var $references = $('<div>').appendTo($('.item_content'))

      getGoogleResults(function(hits) {
        hits.forEach(function(hit) {
          appendSimilarPost($references, hit)
        })
      })
    }
  }
})();
