---
layout: js-compress
---
/*

Get latest GitHub tag
by ircama, 2016

# Legal Info (MIT License)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

(function ($) {
    function widgetTags(element, options, callback) {
        this.element = element;
        this.options = options;
        this.callback = $.isFunction(callback) ? callback : $.noop;
    }

    widgetTags.prototype = (function() {

        function getTags(user, repo, element, callback) {
            $.ajax({
                url: "https://api.github.com/repos/" + user + repo + "/tags",
                dataType: 'jsonp',
                success: callback,
                error: function(){
                }
            });
        }

        function _widgetTagsRun(widgetTags) {
            if (!widgetTags.options) {
                widgetTags.element.append('<span class="error">Options for widgetTags are not set.</span>');
                return;
            }
            var callback = widgetTags.callback;
            var element = widgetTags.element;
            var user = widgetTags.options.user;
            var repo = widgetTags.options.repo;
            if ((repo.length<1) || (repo.substring(0, 1) != '/'))
              repo = '/' + repo;

            getTags(user, repo, element, function (data) {
                var tags = data.data;

                element.empty();

                if (tags.length  === undefined)
                {
                  element.append('<span class="noprint">check ' + '<a class="github-tag" href="' + 'https://github.com/' + user + repo + '/tags' + '" target="_blank">here</a></span>');
                  return;
                }

                if (tags.length  == 0)
                {
                  element.append('<span class="noprint">no tag; check ' + '<a class="github-tag" href="' + 'https://github.com/' + user + repo + '/tags' + '" target="_blank">here</a></span>');
                  return;
                }

                var cur = tags[0];

                var li = $('<a class="github-tag-name">')
                  .attr("title", 'Last GitHub tag')
                  .attr("href", 'https://github.com/' + user + repo + '/tags/')
                  .attr("target","_blank")
                  .text(cur.name)
                  .appendTo(element);

                callback(element);
            });
        }

        return {
            run: function () {
                _widgetTagsRun(this);
            }
        };

    })();

    $.fn.githubWidgetTags = function(options, callback) {
        this.each(function () {
            new widgetTags($(this), options, callback)
                .run();
        });
        return this;
    };

})(jQuery);
