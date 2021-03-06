i.js
====

What  is [i.js](https://github.com/mksenzov/i.js)? It is is a browser-based tool that brings the style of computation pioneered by [IPython Notebook](http://ipython.org/notebook.html) to those of us who want to use JavaScript. 

If you have never seen IPython Notebook before, then you will unlikely find this explanation satisfactory. It seems to me that the easiest way to show what I mean is to quote the original IPython Notebook's documentation:

> The [IPython] Notebook [...] is [..] providing a web-based application suitable for capturing the whole computation process: developing, documenting, and executing code, as well as communicating the results. The IPython notebook combines two components:

> **A web application**: a browser-based tool for interactive authoring of documents which combine explanatory text, mathematics, computations and their rich media output.

> **Notebook documents**: a representation of all content visible in the web application, including inputs and outputs of the computations, explanatory text, mathematics, images, and rich media representations of objects.

As of now i.js has the following features:

* **Syntax highlight** and **Code auto-completion**
* **Basic management** of i.js documents (from this point on I will call them 'scrapbooks'): create, delete, rename.
* **REPL/server decoupling.** Each scrapbook has it's own JavaScript REPL attached. That means that when you use different scrapbooks they do not interfere. It also means that scrapbook evaluation environment is separated from the actual node.js server, so no matter what happens in a REPL session the core i.js server should be up and running.
* **Full execution flow control.** A scrapbook is essentially a collections of small JavaScript code snippets ('cells') that can be evaluated and edited independently. You have the full control of which cells should be executed and in what order. You can also edit and re-evaluate cells as you see fit, that allows one to run iterative experiments with a super-short feedback cycle.

How about a screenshot?
-----------------------

![i.js screenshot](http://i.imgur.com/phcYx8P.png "i.js screenshot")

Why?
----

The following are my reasons for developing i.js:

* **Language.** As the name implies, IPython Notebook speaks python. Although browser consoles and JS REPL are decent alternatives, I was looking for the IPython Notebook style of iterative computation and ability to run repetitive experiments.
* **Matplotlib.** IPython Notebook is tightly integrated with [matplotlib](http://matplotlib.org), which is a great library if you are preparing an article for publication. However I want to render more interactive charts in [d3.js](http://d3js.org). While it seems possible to hack your way through to get d3.js graphics in IPython - it feel convoluted.
* **Great model.** IPython Notebook is a unique tool that suggests a beautiful paradigm for research and experimentation. It should be made available to the widest audience possible.
* **Fun** Last but not the least: full-stack JS applications are fun. 

How can I generate a D3 chart?
------------------------------

As always you do all your data processing on the server. D3 will be executed on the server as well. Once this is done you will receive an SVG on the client and i.js will render it for you.

Here I will use an adopted Mike Bostock's [example](http://bost.ocks.org/mike/bar/):

* First of all include d3 library 

```javascript
%init_d3
```

This is essentially a syntactic sugar for including d3 into the i.js context. Instead of the magic command
above one could inject any module dependency like this:

```javascript
var d3 = require('./d3');
```

* Now get some data 

```javascript
var data = [4, 8, 15, 16, 23, 42];
```

* Next you will need to create an empty container for your chart: 

```javascript
var container = d3Container();
```

* From that point on you can do your normal D3 coding, for example you can style your container the way you want:

```javascript
container.append("style").text(
  ".chart div {\
  	background-color: steelblue; \
  	text-align: right; \
  	padding: 3px; \
  	margin: 1px; \
  	color: white; \
  }");
```

* Now you can render some bars:

```javascript
var chart = container.append("div").attr("class", "chart");
var width = function(d) { return d * 10 + "px"; };
var text = function(d) { return d; };
var svg = chart.selectAll("div").data(data).enter().append("div").style("width", width).text(text);
```

* Your chart is generated on server, and now all you need is just to render the result in your scrapbook, use the special character _%_ for this (it should be the first character in the cell):

```javascript
%inline
container.render()
```

See prepackaged _d3_ example scrapbooks for more details.

How it was built?
-----------------

i.js is built on top of:

1. [node.js](http://nodejs.org) + [express](http://expressjs.com/api.html) + [jade](http://jade-lang.com)
2. [Bootstrap](http://getbootstrap.com) as you can immediately see from the screenshot above
3. [REPL](http://nodejs.org/api/repl.html) for evaluating scrapbooks and getting code auto-completion hints
4. [CodeMirror](http://codemirror.net) for code syntax-highlight and auto-completion UI
5. [JQuery](http://jquery.com) for browser scripting
6. [d3.js](http://d3js.org) for charts rendering.

Installation
-------------

1. Install node from http://nodejs.org if you have not done it yet
2. Clone i.js from git: _git clone https://github.com/mksenzov/i.js_
3. Go to the cloned repo: _cd i.js_
4. Install all i.js dependencies: _npm install_
5. Start i.js server: _node app.js_
6. Now you can open i.js in the browser: http://localhost:3000
7. [Optional] To run tests: _node_modules/jasmine-node/bin/jasmine-node --verbose spec_

Usage
-----

**Shortcuts**

* Use _Shift+Enter_ to evaluate the current cell
* Use _Ctrl+Space_ to auto-complete the code
* Use _Ctrl+S_ (_Meta+S_) to save the current i.js scrapbook

**Special commands and built-in definitions **

Built-in variables

* __base_dir - is a pre-defined variable pointing to i.js base directory.

Use any of the following within i.js cells:

* _%inline_ the result of cell evaluation should be rendered as HTML.
* _%clear_ clear the context.
