/**
 * @file            transport_jquery.js
 * @description     鐢ㄤ簬鏀寔AJAX鐨勪紶杈撶被銆�
 * @author          ECShop R&D Team ( http://www.ecmoban.com/ )
 * @date            2007-03-08 Wednesday
 * @license         Licensed under the Academic Free License 2.1 http://www.opensource.org/licenses/afl-2.1.php
 * @version         1.0.20070308
**/

var Transport =
{
  /* *
  * 瀛樺偍鏈璞℃墍鍦ㄧ殑鏂囦欢鍚嶃€�
  *
  * @static
  */
  filename : "transport_jquery.js",

  /* *
  * 瀛樺偍鏄惁杩涘叆璋冭瘯妯″紡鐨勫紑鍏筹紝鎵撳嵃璋冭瘯娑堟伅鐨勬柟寮忥紝鎹㈣绗︼紝璋冭瘯鐢ㄧ殑瀹瑰櫒鐨処D銆�
  *
  * @private
  */
  debugging :
  {
    isDebugging : 0,
    debuggingMode : 0,
    linefeed : "",
    containerId : 0
  },

  /* *
  * 璁剧疆璋冭瘯妯″紡浠ュ強鎵撳嵃璋冭瘯娑堟伅鏂瑰紡鐨勬柟娉曘€�
  *
  * @public
  * @param   {int}   鏄惁鎵撳紑璋冭瘯妯″紡      0锛氬叧闂紝1锛氭墦寮€
  * @param   {int}   鎵撳嵃璋冭瘯娑堟伅鐨勬柟寮�    0锛歛lert锛�1锛歩nnerHTML
  *
  */
  debug : function (isDebugging, debuggingMode)
  {
    this.debugging =
    {
      "isDebugging" : isDebugging,
      "debuggingMode" : debuggingMode,
      "linefeed" : debuggingMode ? "<br />" : "\n",
      "containerId" : "dubugging-container" + new Date().getTime()
    };
  },

  /* *
  * 浼犺緭瀹屾瘯鍚庤嚜鍔ㄨ皟鐢ㄧ殑鏂规硶锛屼紭鍏堢骇姣旂敤鎴蜂粠run()鏂规硶涓紶鍏ョ殑鍥炶皟鍑芥暟楂樸€�
  *
  * @public
  */
  onComplete : function ()
  {
  },

  /* *
  * 浼犺緭杩囩▼涓嚜鍔ㄨ皟鐢ㄧ殑鏂规硶銆�
  *
  * @public
  */
  onRunning : function ()
  {
  },

  /* *
  * 璋冪敤姝ゆ柟娉曞彂閫丠TTP璇锋眰銆�
  *
  * @public
  * @param   {string}    url             璇锋眰鐨刄RL鍦板潃
  * @param   {mix}       params          鍙戦€佸弬鏁�
  * @param   {Function}  callback        鍥炶皟鍑芥暟
  * @param   {string}    ransferMode     璇锋眰鐨勬柟寮忥紝鏈�"GET"鍜�"POST"涓ょ
  * @param   {string}    responseType    鍝嶅簲绫诲瀷锛屾湁"JSON"銆�"XML"鍜�"TEXT"涓夌
  * @param   {boolean}   asyn            鏄惁寮傛璇锋眰鐨勬柟寮�
  * @param   {boolean}   quiet           鏄惁瀹夐潤妯″紡璇锋眰
  */
  run : function (url, params, callback, transferMode, responseType, asyn, quiet)
  {
    /* 澶勭悊鐢ㄦ埛鍦ㄨ皟鐢ㄨ鏂规硶鏃惰緭鍏ョ殑鍙傛暟 */
    params = this.parseParams(params);
    transferMode = typeof(transferMode) === "string"
    && transferMode.toUpperCase() === "GET"
    ? "GET"
    : "POST";

    if (transferMode === "GET")
    {
      var d = new Date();

      url += params ? (url.indexOf("?") === - 1 ? "?" : "&") + params : "";
      url = encodeURI(url) + (url.indexOf("?") === - 1 ? "?" : "&") + d.getTime() + d.getMilliseconds();
      params = null;
    }

    responseType = typeof(responseType) === "string" && ((responseType = responseType.toUpperCase()) === "JSON" || responseType === "XML") ? responseType : "TEXT";
    asyn = asyn === false ? false : true;

    /* 澶勭悊HTTP璇锋眰鍜屽搷搴� */
    var xhr = this.createXMLHttpRequest();

    try
    {
      var self = this;

      if (typeof(self.onRunning) === "function" && !quiet)
      {
        self.onRunning();
      }

      xhr.open(transferMode, url, asyn);

      if (transferMode === "POST")
      {
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      }

      if (asyn)
      {
        xhr.onreadystatechange = function ()
        {
          if (xhr.readyState == 4)
          {
            switch ( xhr.status )
            {
              case 0:
              case 200: // OK!
                /*
                 * If the request was to create a new resource
                 * (such as post an item to the database)
                 * You could instead return a status code of '201 Created'
                 */

                if (typeof(self.onComplete) === "function")
                {
                  self.onComplete();
                }

                if (typeof(callback) === "function")
                {
                  callback.call(self, self.parseResult(responseType, xhr), xhr.responseText);
                }
              break;

              case 304: // Not Modified
                /*
                 * This would be used when your Ajax widget is
                 * checking for updated content,
                 * such as the Twitter interface.
                 */
              break;

              case 400: // Bad Request
                /*
                 * A bit like a safety net for requests by your JS interface
                 * that aren't supported on the server.
                 * "Your browser made a request that the server cannot understand"
                 */
                 alert("XmlHttpRequest status: [400] Bad Request");
              break;

              case 404: // Not Found
                alert("XmlHttpRequest status: [404] \nThe requested URL "+url+" was not found on this server.");
              break;

              case 409: // Conflict
                /*
                 * Perhaps your JavaScript request attempted to
                 * update a Database record
                 * but failed due to a conflict
                 * (eg: a field that must be unique)
                 */
              break;

              case 503: // Service Unavailable
                /*
                 * A resource that this request relies upon
                 * is currently unavailable
                 * (eg: a file is locked by another process)
                 */
                 alert("XmlHttpRequest status: [503] Service Unavailable");
              break;

              default:
                alert("XmlHttpRequest status: [" + xhr.status + "] Unknow status.");
            }

            xhr = null;
          }
        }
        if (xhr != null) xhr.send(params);
      }
      else
      {
        if (typeof(self.onRunning) === "function")
        {
          self.onRunning();
        }

        xhr.send(params);

        var result = self.parseResult(responseType, xhr);
        //xhr = null;

        if (typeof(self.onComplete) === "function")
        {
          self.onComplete();
        }
        if (typeof(callback) === "function")
        {
          callback.call(self, result, xhr.responseText);
        }

        return result;
      }
    }
    catch (ex)
    {
      if (typeof(self.onComplete) === "function")
      {
        self.onComplete();
      }

      alert(this.filename + "/run() error:" + ex.description);
    }
  },

  /* *
  * 濡傛灉寮€鍚簡璋冭瘯妯″紡锛岃鏂规硶浼氭墦鍗板嚭鐩稿簲鐨勪俊鎭€�
  *
  * @private
  * @param   {string}    info    璋冭瘯淇℃伅
  * @param   {string}    type    淇℃伅绫诲瀷
  */
  displayDebuggingInfo : function (info, type)
  {
    if ( ! this.debugging.debuggingMode)
    {
      alert(info);
    }
    else
    {

      var id = this.debugging.containerId;
      if ( ! document.getElementById(id))
      {
        div = document.createElement("DIV");
        div.id = id;
        div.style.position = "absolute";
        div.style.width = "98%";
        div.style.border = "1px solid #f00";
        div.style.backgroundColor = "#eef";
        var pageYOffset = document.body.scrollTop
        || window.pageYOffset
        || 0;
        div.style.top = document.body.clientHeight * 0.6
        + pageYOffset
        + "px";
        document.body.appendChild(div);
        div.innerHTML = "<div></div>"
        + "<hr style='height:1px;border:1px dashed red;'>"
        + "<div></div>";
      }

      var subDivs = div.getElementsByTagName("DIV");
      if (type === "param")
      {
        subDivs[0].innerHTML = info;
      }
      else
      {
        subDivs[1].innerHTML = info;
      }
    }
  },

  /* *
  * 鍒涘缓XMLHttpRequest瀵硅薄鐨勬柟娉曘€�
  *
  * @private
  * @return      杩斿洖涓€涓猉MLHttpRequest瀵硅薄
  * @type    Object
  */
  createXMLHttpRequest : function ()
  {
    var xhr = null;

    if (window.ActiveXObject)
    {
      var versions = ['Microsoft.XMLHTTP', 'MSXML6.XMLHTTP', 'MSXML5.XMLHTTP', 'MSXML4.XMLHTTP', 'MSXML3.XMLHTTP', 'MSXML2.XMLHTTP', 'MSXML.XMLHTTP'];

      for (var i = 0; i < versions.length; i ++ )
      {
        try
        {
          xhr = new ActiveXObject(versions[i]);
          break;
        }
        catch (ex)
        {
          continue;
        }
      }
    }
    else
    {
      xhr = new XMLHttpRequest();
    }

    return xhr;
  },

  /* *
  * 褰撲紶杈撹繃绋嬪彂鐢熼敊璇椂灏嗚皟鐢ㄦ鏂规硶銆�
  *
  * @private
  * @param   {Object}    xhr     XMLHttpRequest瀵硅薄
  * @param   {String}    url     HTTP璇锋眰鐨勫湴鍧€
  */
  onXMLHttpRequestError : function (xhr, url)
  {
    throw "URL: " + url + "\n"
    +  "readyState: " + xhr.readyState + "\n"
    + "state: " + xhr.status + "\n"
    + "headers: " + xhr.getAllResponseHeaders();
  },

  /* *
  * 瀵瑰皢瑕佸彂閫佺殑鍙傛暟杩涜鏍煎紡鍖栥€�
  *
  * @private
  * @params {mix}    params      灏嗚鍙戦€佺殑鍙傛暟
  * @return 杩斿洖鍚堟硶鐨勫弬鏁�
  * @type string
  */
  parseParams : function (params)
  {
    var legalParams = "";
    params = params ? params : "";

    if (typeof(params) === "string")
    {
      legalParams = params;
    }
    else if (typeof(params) === "object")
    {
      try
      {
        legalParams = "JSON=" + $.toJSON(params);
      }
      catch (ex)
      {
        alert("Can't stringify JSON!");
        return false;
      }
    }
    else
    {
      alert("Invalid parameters!");
      return false;
    }

    if (this.debugging.isDebugging)
    {
      var lf = this.debugging.linefeed,
      info = "[Original Parameters]" + lf + params + lf + lf
      + "[Parsed Parameters]" + lf + legalParams;

      this.displayDebuggingInfo(info, "param");
    }

    return legalParams;
  },

  /* *
  * 瀵硅繑鍥炵殑HTTP鍝嶅簲缁撴灉杩涜杩囨护銆�
  *
  * @public
  * @params   {mix}   result   HTTP鍝嶅簲缁撴灉
  * @return  杩斿洖杩囨护鍚庣殑缁撴灉
  * @type string
  */
  preFilter : function (result)
  {
    return result.replace(/\xEF\xBB\xBF/g, "");
  },

  /* *
  * 瀵硅繑鍥炵殑缁撴灉杩涜鏍煎紡鍖栥€�
  *
  * @private
  * @return 杩斿洖鐗瑰畾鏍煎紡鐨勬暟鎹粨鏋�
  * @type mix
  */
  parseResult : function (responseType, xhr)
  {
    var result = null;

    switch (responseType)
    {
      case "JSON" :
        result = this.preFilter(xhr.responseText);
        try
        {
          result = $.evalJSON(result);
        }
        catch (ex)
        {
          // throw this.filename + "/parseResult() error: can't parse to JSON.\n\n" + xhr.responseText;
        }
        break;
      case "XML" :
        result = xhr.responseXML;
        break;
      case "TEXT" :
        result = this.preFilter(xhr.responseText);
        break;
      default :
        throw this.filename + "/parseResult() error: unknown response type:" + responseType;
    }

    if (this.debugging.isDebugging)
    {
      var lf = this.debugging.linefeed,
      info = "[Response Result of " + responseType + " Format]" + lf
      + result;

      if (responseType === "JSON")
      {
        info = "[Response Result of TEXT Format]" + lf
        + xhr.responseText + lf + lf
        + info;
      }

      this.displayDebuggingInfo(info, "result");
    }

    return result;
  }
};

/* 瀹氫箟涓や釜鍒悕 */
var Ajax = Transport;
Ajax.call = Transport.run;

/*
    json.js
    2007-03-06

    Public Domain

    This file adds these methods to JavaScript:

        array.toJSONString()
        boolean.toJSONString()
        date.toJSONString()
        number.toJSONString()
        object.toJSONString()
        string.toJSONString()
            These methods produce a JSON text from a JavaScript value.
            It must not contain any cyclical references. Illegal values
            will be excluded.

            The default conversion for dates is to an ISO string. You can
            add a toJSONString method to any date object to get a different
            representation.

        string.parseJSON(filter)
            This method parses a JSON text to produce an object or
            array. It can throw a SyntaxError exception.

            The optional filter parameter is a function which can filter and
            transform the results. It receives each of the keys and values, and
            its return value is used instead of the original value. If it
            returns what it received, then structure is not modified. If it
            returns undefined then the member is deleted.

            Example:

            // Parse the text. If a key contains the string 'date' then
            // convert the value to a date.

            myData = text.parseJSON(function (key, value) {
                return key.indexOf('date') >= 0 ? new Date(value) : value;
            });

    It is expected that these methods will formally become part of the
    JavaScript Programming Language in the Fourth Edition of the
    ECMAScript standard in 2008.
*/

// Augment the basic prototypes if they have not already been augmented.
/*
if ( ! Object.prototype.toJSONString) {
    Array.prototype.toJSONString = function () {
        var a = ['['], // The array holding the text fragments.
            b,         // A boolean indicating that a comma is required.
            i,         // Loop counter.
            l = this.length,
            v;         // The value to be stringified.

        function p(s) {

            // p accumulates text fragments in an array. It inserts a comma before all
            // except the first fragment.

            if (b) {
              a.push(',');
            }
            a.push(s);
            b = true;
        }

        // For each value in this array...

        for (i = 0; i < l; i ++) {
            v = this[i];
            switch (typeof v) {

            // Values without a JSON representation are ignored.

            case 'undefined':
            case 'function':
            case 'unknown':
                break;

            // Serialize a JavaScript object value. Ignore objects thats lack the
            // toJSONString method. Due to a specification error in ECMAScript,
            // typeof null is 'object', so watch out for that case.

            case 'object':
                if (v) {
                    if (typeof v.toJSONString === 'function') {
                        p(v.toJSONString());
                    }
                } else {
                    p("null");
                }
                break;

            // Otherwise, serialize the value.

            default:
                p(v.toJSONString());
            }
        }

        // Join all of the fragments together and return.

        a.push(']');
        return a.join('');
    };

    Boolean.prototype.toJSONString = function () {
        return String(this);
    };

    Date.prototype.toJSONString = function () {

        // Ultimately, this method will be equivalent to the date.toISOString method.

        function f(n) {

            // Format integers to have at least two digits.

            return n < 10 ? '0' + n : n;
        }

        return '"' + this.getFullYear() + '-' +
                f(this.getMonth() + 1) + '-' +
                f(this.getDate()) + 'T' +
                f(this.getHours()) + ':' +
                f(this.getMinutes()) + ':' +
                f(this.getSeconds()) + '"';
    };

    Number.prototype.toJSONString = function () {

        // JSON numbers must be finite. Encode non-finite numbers as null.

        return isFinite(this) ? String(this) : "null";
    };

    Object.prototype.toJSONString = function () {
        var a = ['{'],  // The array holding the text fragments.
            b,          // A boolean indicating that a comma is required.
            k,          // The current key.
            v;          // The current value.

        function p(s) {

            // p accumulates text fragment pairs in an array. It inserts a comma before all
            // except the first fragment pair.

            if (b) {
                a.push(',');
            }
            a.push(k.toJSONString(), ':', s);
            b = true;
        }

        // Iterate through all of the keys in the object, ignoring the proto chain.

        for (k in this) {
            if (this.hasOwnProperty(k)) {
                v = this[k];
                switch (typeof v) {

                // Values without a JSON representation are ignored.

                case 'undefined':
                case 'function':
                case 'unknown':
                    break;

                // Serialize a JavaScript object value. Ignore objects that lack the
                // toJSONString method. Due to a specification error in ECMAScript,
                // typeof null is 'object', so watch out for that case.

                case 'object':
                    if (this !== window)
                    {
                      if (v) {
                          if (typeof v.toJSONString === 'function') {
                              p(v.toJSONString());
                          }
                      } else {
                          p("null");
                      }
                    }
                    break;
                default:
                    p(v.toJSONString());
                }
            }
        }

          // Join all of the fragments together and return.

        a.push('}');
        return a.join('');
    };

    (function (s) {

        // Augment String.prototype. We do this in an immediate anonymous function to
        // avoid defining global variables.

        // m is a table of character substitutions.

        var m = {
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        };

        s.parseJSON = function (filter) {

            // Parsing happens in three stages. In the first stage, we run the text against
            // a regular expression which looks for non-JSON characters. We are especially
            // concerned with '()' and 'new' because they can cause invocation, and '='
            // because it can cause mutation. But just to be safe, we will reject all
            // unexpected characters.

            try {
                if (/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.
                        test(this)) {

                    // In the second stage we use the eval function to compile the text into a
                    // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                    // in JavaScript: it can begin a block or an object literal. We wrap the text
                    // in parens to eliminate the ambiguity.

                    var j = eval('(' + this + ')');

                    // In the optional third stage, we recursively walk the new structure, passing
                    // each name/value pair to a filter function for possible transformation.

                    if (typeof filter === 'function') {

                        function walk(k, v) {
                            if (v && typeof v === 'object') {
                                for (var i in v) {
                                    if (v.hasOwnProperty(i)) {
                                        v[i] = walk(i, v[i]);
                                    }
                                }
                            }
                            return filter(k, v);
                        }

                        j = walk('', j);
                    }
                    return j;
                }
            } catch (e) {

            // Fall through if the regexp test fails.

            }
            throw new SyntaxError("parseJSON");
        };

        s.toJSONString = function () {

          // If the string contains no control characters, no quote characters, and no
          // backslash characters, then we can simply slap some quotes around it.
          // Otherwise we must also replace the offending characters with safe
          // sequences.

          // add by weberliu @ 2007-4-2
          var _self = this.replace("&", "%26");

          if (/["\\\x00-\x1f]/.test(this)) {
              return '"' + _self.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                  var c = m[b];
                  if (c) {
                      return c;
                  }
                  c = b.charCodeAt();
                  return '\\u00' +
                      Math.floor(c / 16).toString(16) +
                      (c % 16).toString(16);
              }) + '"';
          }
          return '"' + _self + '"';
        };
    })(String.prototype);
}
*/
//Ajax.onRunning  = showLoader;
//Ajax.onComplete = hideLoader;

/* *
 * 鏄剧ず杞藉叆淇℃伅
 */
function showLoader()
{
  document.getElementsByTagName('body').item(0).style.cursor = "wait";

  if (top.frames['header-frame'] && top.frames['header-frame'].document.getElementById("load-div"))
  {
    top.frames['header-frame'].document.getElementById("load-div").style.display = "block";

  }
  else
  {
    var obj = document.getElementById('loader');

    if ( ! obj && typeof(process_request) != 'undefined')
    {
      obj = document.createElement("DIV");
      obj.id = "loader";
      obj.innerHTML = process_request;

      document.body.appendChild(obj);
    }
  }
}

/* *
 * 闅愯棌杞藉叆淇℃伅
 */
function hideLoader()
{
  document.getElementsByTagName('body').item(0).style.cursor = "auto";
  if (top.frames['header-frame'] && top.frames['header-frame'].document.getElementById("load-div"))
  {
    setTimeout(function(){top.frames['header-frame'].document.getElementById("load-div").style.display = "none"}, 10);
  }
  else
  {
    try
    {
      var obj = document.getElementById("loader");
      obj.style.display = 'none';
      document.body.removeChild(obj);
    }
    catch (ex)
    {}
  }
}