import React, { useState, useEffect, useContext } from 'react';
import './App.css';
import { Parser } from 'html-to-react';
import { XmlEntities } from 'html-entities';
import 'font-awesome/css/font-awesome.min.css';

var htmlToReactParser = new Parser();
var entities = new XmlEntities();

const ThemeContext = React.createContext();

function App() {
  const [srdata, setSrdata] = useState(null);
  const [subreddit, setSubreddit] = useState("");
  const [fetching, setFetching] = useState(false);
  const [theme, setTheme] = useState('default');

  useEffect(() => {
    fetchSubredditData("rust");
  }, []);

  useEffect(() => {
    if (!srdata) return;
    document.title = srdata.data.children[0].data.subreddit + ' posts';
  });

  const fetchSubredditData = async (subreddit) => {

    let data = {
      subreddit,
    }

    let res = await fetch(`/subreddit/data/`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    if (!res) return;

    let srdata = await res.json();
    if (!srdata) return;
    if (!srdata.data) return;

    setFetching(false);
    setSrdata(srdata);
  }

  const onSubredditChange = (e) => {
    let value = e.target.value.replace(/\s/g, '');
    setSubreddit(value);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    fetchSubredditData(subreddit);
  }

  let posts = null;
  if (srdata && srdata.data) {
    posts = srdata.data.children.map((item, index) => {
      return <Post key={index.toString() + subreddit} item={item} />
    });
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className="app">
        <header><h1>Reddit Client</h1><ThemeToggle /></header>
        <form onSubmit={onSubmit}>
          <input
            value={subreddit}
            placeholder="Search for a subreddit"
            onChange={onSubredditChange} />
        </form>
        {fetching && <Spinner />}
        {posts && posts}
      </div>
    </ThemeContext.Provider>
  );
}

function Post(props) {
  const [clicked, setClicked] = useState(false);
  const ctx = useContext(ThemeContext);

  const onClick = () => {
    setClicked(!clicked);
  }

  const onLinkClick = (e) => {
    e.stopPropagation();
  }

  let hasContent = props.item.data.selftext_html ? true : false;

  let element = null;
  if (clicked && hasContent) {
    let decoded = entities.decode(props.item.data.selftext_html);
    element = htmlToReactParser.parse(decoded);
  }

  return (
    <section className={`post ${ctx.theme}`}>
      <p className="post-paragraph" onClick={onClick}>
        <div className={`icon ${ctx.theme}`}>
          {hasContent && <span className="fa fa-search" />}
        </div>
        <a className={`icon ${ctx.theme}`} href={props.item.data.url} onClick={onLinkClick} target="_blank" rel="noopener noreferrer"><span className="fa fa-link"></span></a>
        {props.item.data.title}
      </p>
      {clicked && element &&
        <div className="selftext">{element}</div>}
    </section>
  );
}
export default App;

const Spinner = () =>
  <div className="spinner">
    <div className="lds-ellipsis"><div></div><div></div><div></div><div></div></div>
  </div>;

const ThemeToggle = () => {
  const ctx = useContext(ThemeContext);
  const toggleTheme = (newtheme) => {
    ctx.theme === 'default' ? ctx.setTheme('dark') : ctx.setTheme('default');
  }

  return (
    <button onClick={toggleTheme} className={ctx.theme}>Theme: {ctx.theme.charAt(0).toUpperCase() + ctx.theme.slice(1)}</button>
  );
}
