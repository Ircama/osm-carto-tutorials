---
layout: js-compress
---
/*

Modified by ircama, 2016; added the following options:
- nouser (true/false/unset): if set to true, does not show user
- noavatar (true/false/unset): if set to true, does not show avatar
- nomsg (true/false/unset): if set to true, does not show message
- abstime (true/false/unset): if set to true, shows absolute time
- noreltime (true/false/unset): if set to true, does not show relative time
- simple (unset, 1, 2): if set to 1, shows a simple message without list; if set to 2, also show the number of commits in the tooltip

https://github.com/alexanderbeletsky/github-commits-widget

# Legal Info (MIT License)

Copyright (c) 2012 Alexander Beletsky

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
    function widget(element, options, callback) {
        this.element = element;
        this.options = options;
        this.callback = $.isFunction(callback) ? callback : $.noop;
    }

    widget.prototype = (function() {

        function getCommits(user, repo, branch, path, simple, element, callback) {
            $.ajax({
                url: "https://api.github.com/repos/" + user + repo + "/commits?sha=" + branch + (path === undefined ? '' : "&path=" + path),
                dataType: 'jsonp',
                success: callback,
                error: function(){
                  if (simple)
                  {
                    element.empty();
                    element.append((simple < 2 ? ' ' : ': ') + '<span class="noprint">check ' + '<a class="github-commit" href="' + 'https://github.com/' + user + repo + '/commits/' + branch + (path === undefined ? '' : '/' + path) + '" target="_blank">here</a></span>');
                  }
                }
            });
        }

        function _widgetRun(widget) {
            if (!widget.options) {
                widget.element.append('<span class="error">Options for widget are not set.</span>');
                return;
            }
            var callback = widget.callback;
            var element = widget.element;
            var user = widget.options.user;
            var nouser = widget.options.nouser === undefined ? 0 : nouser = widget.options.nouser;
            var noavatar = widget.options.noavatar === undefined ? 0 : noavatar = widget.options.noavatar;
            var nomsg = widget.options.nomsg === undefined ? 0 : widget.options.nomsg;
            var abstime = widget.options.abstime === undefined ? 0 : widget.options.abstime;
            var noreltime = widget.options.noreltime === undefined ? 0 : widget.options.noreltime;
            var repo = widget.options.repo;
            if ((repo.length<1) || (repo.substring(0, 1) != '/'))
              repo = '/' + repo;
            var branch = widget.options.branch;
            var path = widget.options.path;
            var avatarSize = widget.options.avatarSize || 20;
            var simple = widget.options.simple === undefined ? 0 : widget.options.simple;
            var last = widget.options.last === undefined ? 0 : widget.options.last;
            var limitMessage = widget.options.limitMessageTo === undefined ? 0 : widget.options.limitMessageTo;

            getCommits(user, repo, branch, path, simple, element, function (data) {
                var commits = data.data;
                var totalCommits = (last < commits.length ? last : commits.length);

                element.empty();

                if (totalCommits  === undefined)
                {
                  element.append((simple < 2 ? ' ' : ': ') + '<span class="noprint">check ' + '<a class="github-commit" href="' + 'https://github.com/' + user + repo + '/commits/' + branch + (path === undefined ? '' : '/' + path) + '" target="_blank">here</a></span>');
                  return;
                }

                if (!simple)
                  var list = $('<ul class="github-commits-list">').appendTo(element);

                for (var c = 0; c < totalCommits; c++) {
                    var cur = commits[c];

                    if (simple)
                    {
                    element.append(' ');

                    var li = $('<a class="github-commit">')
                      .attr("title", ((simple < 2) ? 'Last commits: ' + commits.length + '. Message in last commit:\n' : '') + cur.commit.message.replace(/\t/g, ' '))
                      .attr("href", 'https://github.com/' + user + repo + '/commits/' + branch + (path === undefined ? '' : '/' + path))
                      .attr("target","_blank")
                      .appendTo(element);
                    }
                    else
                    {
                      var li = $("<li>");
                    }

                    if (!nouser)
                    {
                      var e_user = $('<span class="github-user">');
                      //add avatar & github link if possible
                      if (cur.author !== null) {
                          if (!noavatar)
                            e_user.append(avatar(cur.author.gravatar_id, avatarSize));
                          e_user.append(author(cur.author.login));
                      }
                      else //otherwise just list the name
                      {
                          e_user.append(cur.commit.committer.name);
                      }
                      li.append(e_user);
                    }

                    //add commit message
                    if (!nomsg)
                      li.append(message(cur.commit.message.replace(/\t/g, ' '), cur.sha));

                    if (abstime)
                    {
                      li.append('<span class=github-commit-date>' + timewhen(cur.commit.committer.date) + '</span>');
                    }
                    if (!noreltime)
                      li.append('<span class="github-commit-reltime noprint">' + (abstime ? ', ' : '') + when(cur.commit.committer.date) + '</span>');

                    if (!simple)
                      list.append(li);
                }

                callback(element);

                function avatar(hash, size) {
                    return $('<img>')
                            .attr('class', 'github-avatar')
                            .attr('src', 'https://www.gravatar.com/avatar/' + hash + '?s=' + size);
                }

                function author(login) {
                    return  $('<a>')
                            .attr("href", 'https://github.com/' + login)
                            .text(login);
                }

                function message(commitMessage, sha) {
                    var originalCommitMessage = commitMessage;
                    if (limitMessage > 0 && commitMessage.length > limitMessage)
                    {
                        commitMessage = commitMessage.substr(0, limitMessage) + '...';
                    }

                    var link = $('<a class="github-commit"></a>')
                      .attr("title", originalCommitMessage)
                      .attr("href", 'https://github.com/' + user + repo + '/commit/' + sha)
                      .text(commitMessage);

                    return link;
                }

                function when(commitDate) {
                    var commitTime = new Date(commitDate).getTime();
                    var todayTime = new Date().getTime();

                    var differenceInDays = Math.floor(((todayTime - commitTime)/(24*3600*1000)));
                    if (differenceInDays === 0) {
                        var differenceInHours = Math.floor(((todayTime - commitTime)/(3600*1000)));
                        if (differenceInHours === 0) {
                            var differenceInMinutes = Math.floor(((todayTime - commitTime)/(600*1000)));
                            if (differenceInMinutes === 0) {

                                return 'just now';
                            }

                            return 'about ' + differenceInMinutes + ' minutes ago';
                        }

                        return 'about ' + differenceInHours + ' hours ago';
                    } else if (differenceInDays == 1) {
                        return 'yesterday';
                    }
                    if (differenceInDays > 365)
                    {
                      return 'about ' + ( Math.round( differenceInDays / 365 * 10) / 10 )  + ' year(s) ago';
                    }
                    if (differenceInDays > 60)
                    {
                      return 'about ' + ( Math.round( differenceInDays / 30 * 10) / 10 )  + ' month(s) ago';
                    }
                    return differenceInDays + ' days ago';
                }

                function timewhen(commitDate) {
                    var localedate = new Date(commitDate).toISOString().slice(0, 10);
                    return localedate;
                }
            });
        }

        return {
            run: function () {
                _widgetRun(this);
            }
        };

    })();

    $.fn.githubInfoWidget = function(options, callback) {
        this.each(function () {
            new widget($(this), options, callback)
                .run();
        });
        return this;
    };

})(jQuery);
